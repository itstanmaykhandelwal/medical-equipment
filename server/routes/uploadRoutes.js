
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

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPG, PNG and WEBP images are allowed.")
        );
    }
};

// Upload temporarily to memory, then optimize before saving.
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
});

router.post(
    "/images",
    authMiddleware,
    adminMiddleware,
    (req, res, next) => {
        upload.array("images", 10)(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message:
                        error.message || "Image upload failed.",
                });
            }

            next();
        });
    },
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
                // Validate the actual image contents, not only MIME type.
                const metadata = await sharp(file.buffer).metadata();

                if (!metadata.format ||
                    !["jpeg", "png", "webp"].includes(metadata.format)) {
                    throw new Error(
                        "One or more files are not valid JPG, PNG or WEBP images."
                    );
                }

                const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
                const outputPath = path.join(uploadDir, filename);

                await sharp(file.buffer, {
                    limitInputPixels: 40000000,
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

                savedFiles.push(outputPath);
                images.push(`/uploads/${filename}`);
            }

            return res.status(201).json({
                success: true,
                message: "Images optimized and uploaded successfully.",
                images,
            });
        } catch (error) {
            // Remove partial uploads if any image fails.
            for (const filePath of savedFiles) {
                try {
                    await fs.promises.unlink(filePath);
                } catch (cleanupError) {
                    console.error(
                        "Failed to remove uploaded file:",
                        cleanupError.message
                    );
                }
            }

            console.error("Image optimization error:", error);

            return res.status(400).json({
                success: false,
                message:
                    "Image optimization failed. Please upload valid JPG, PNG or WEBP images.",
            });
        }
    }
);

module.exports = router;
