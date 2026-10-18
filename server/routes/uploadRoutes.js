const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = allowedTypes[file.mimetype];

        if (!extension) {
            return cb(
                new Error("Only JPG, PNG and WEBP images are allowed.")
            );
        }

        cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedTypes[file.mimetype]) {
            return cb(null, true);
        }

        cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    },
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
                const message =
                    error.code === "LIMIT_FILE_SIZE"
                        ? "Each image must be 5 MB or smaller."
                        : error.code === "LIMIT_FILE_COUNT"
                        ? "You can upload a maximum of 10 images."
                        : error.message || "Image upload failed.";

                return res.status(400).json({
                    success: false,
                    message,
                });
            }

            next();
        });
    },
    (req, res) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one image.",
            });
        }

        const images = req.files.map(
            (file) => `/uploads/${file.filename}`
        );

        return res.status(201).json({
            success: true,
            message: "Images uploaded successfully.",
            images,
        });
    }
);

module.exports = router;
