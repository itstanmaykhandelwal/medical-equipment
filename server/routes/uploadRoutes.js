const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    return cb(
        new Error(
            `Unsupported image MIME type: ${file.mimetype || "unknown"}. Please upload JPG, PNG or WEBP.`,
        ),
    );
};

// Store files in memory before optimization.
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
});

// Handle upload validation errors separately.
const handleUpload = (req, res, next) => {
    upload.array("images", 10)(req, res, (error) => {
        if (!error) {
            return next();
        }

        console.error("Multer upload error:", {
            name: error.name,
            code: error.code,
            message: error.message,
        });

        return res.status(400).json({
            success: false,
            message:
                error.code === "LIMIT_FILE_SIZE"
                    ? "Each image must be 5 MB or smaller."
                    : error.code === "LIMIT_FILE_COUNT"
                      ? "You can upload a maximum of 10 images."
                      : error.message || "Image upload failed.",
        });
    });
};

router.post(
    "/images",
    authMiddleware,
    adminMiddleware,
    handleUpload,
    async (req, res) => {
        const savedFiles = [];

        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please select at least one image.",
                });
            }

            const images = [];

            for (const file of req.files) {
                console.log("Processing uploaded image:", {
                    name: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                });

                // Confirm the file has a valid image signature and format.
                let metadata;

                try {
                    metadata = await sharp(file.buffer, {
                        limitInputPixels: 40000000,
                        failOn: "error",
                    }).metadata();
                } catch (error) {
                    console.error("Sharp metadata error:", {
                        file: file.originalname,
                        message: error.message,
                        code: error.code,
                    });

                    throw new Error(
                        `Could not read "${file.originalname}" as an image. Try exporting it as JPG, PNG or WEBP.`,
                    );
                }

                if (
                    !metadata.format ||
                    !["jpeg", "png", "webp"].includes(metadata.format)
                ) {
                    throw new Error(
                        `"${file.originalname}" is not a supported JPG, PNG or WEBP image.`,
                    );
                }

                const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
                const outputPath = path.join(uploadDir, filename);

                try {
                    await sharp(file.buffer, {
                        limitInputPixels: 40000000,
                        failOn: "error",
                    })
                        .rotate()
                        .resize({
                            width: 1600,
                            height: 1600,
                            fit: "inside",
                            withoutEnlargement: true,
                        })
                        .webp({
                            quality: 82,
                            effort: 4,
                        })
                        .toFile(outputPath);
                } catch (error) {
                    console.error("Sharp optimization error:", {
                        file: file.originalname,
                        message: error.message,
                        code: error.code,
                        platform: process.platform,
                        architecture: process.arch,
                        sharpVersions: sharp.versions,
                    });

                    throw new Error(
                        `Could not optimize "${file.originalname}". Please try another image.`,
                    );
                }

                savedFiles.push(outputPath);
                images.push(`/uploads/${filename}`);
            }

            return res.status(201).json({
                success: true,
                message: "Images optimized and uploaded successfully.",
                images,
            });
        } catch (error) {
            // Remove files created by this request if any image fails.
            for (const filePath of savedFiles) {
                try {
                    await fs.promises.unlink(filePath);
                } catch (cleanupError) {
                    console.error(
                        "Failed to remove uploaded file:",
                        cleanupError.message,
                    );
                }
            }

            console.error("Image upload processing failed:", {
                message: error.message,
                code: error.code,
                stack: error.stack,
            });

            return res.status(400).json({
                success: false,
                message: error.message || "Image optimization failed.",
            });
        }
    },
);

module.exports = router;
