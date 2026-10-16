const express = require("express");
const mongoose = require("mongoose");

const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedStatuses = ["new", "in-progress", "resolved"];

// PUBLIC: Submit a contact enquiry
// POST /api/contact
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, confirmEmail, message } =
            req.body || {};

        if (
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            typeof email !== "string" ||
            typeof confirmEmail !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all fields.",
            });
        }

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanConfirmEmail = confirmEmail.trim().toLowerCase();
        const cleanMessage = message.trim();

        if (
            !cleanFirstName ||
            !cleanLastName ||
            !cleanEmail ||
            !cleanConfirmEmail ||
            !cleanMessage
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (
            cleanFirstName.length > 80 ||
            cleanLastName.length > 80 ||
            cleanEmail.length > 254 ||
            cleanMessage.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields exceed the allowed length.",
            });
        }

        if (!validEmail.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        if (cleanEmail !== cleanConfirmEmail) {
            return res.status(400).json({
                success: false,
                message: "Email addresses do not match.",
            });
        }

        const enquiry = await Contact.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            message: cleanMessage,
        });

        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully.",
            enquiryId: enquiry._id,
        });
    } catch (error) {
        console.error("Contact form submission error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to send your message. Please try again.",
        });
    }
});

// ADMIN: Get all enquiries
// GET /api/contact/admin/all
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const enquiries = await Contact.find().sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            enquiries,
        });
    } catch (error) {
        console.error("Fetch contact enquiries error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact enquiries.",
        });
    }
});

// ADMIN: Update enquiry status
// PATCH /api/contact/admin/:id/status
router.patch(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { status } = req.body || {};

            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid enquiry ID.",
                });
            }

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid enquiry status.",
                });
            }

            const enquiry = await Contact.findByIdAndUpdate(
                req.params.id,
                { $set: { status } },
                { new: true, runValidators: true },
            );

            if (!enquiry) {
                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Enquiry status updated successfully.",
                enquiry,
            });
        } catch (error) {
            console.error("Update contact enquiry error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to update enquiry status.",
            });
        }
    },
);

module.exports = router;
