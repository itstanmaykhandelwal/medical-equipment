const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { sendEmail } = require("../utils/emailService");
const {
    loginLimiter,
    signupLimiter,
    passwordResetLimiter,
} = require("../middleware/rateLimiters");

const router = express.Router();

const hashResetToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });

const createAuthToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            userId: user._id.toString(),
            tokenVersion: user.tokenVersion || 0,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );
};

// POST /api/auth/signup
router.post("/signup", signupLimiter, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedName.length < 2 || normalizedName.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 80 characters.",
            });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 128 characters.",
            });
        }

        if (
            phone !== undefined &&
            (typeof phone !== "string" || phone.length > 25)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number.",
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            phone: typeof phone === "string" ? phone.trim() : "",
            password: await bcrypt.hash(password, 12),
        });

        try {
            const safeName = escapeHtml(user.name);

            await sendEmail({
                to: user.email,
                subject: "Welcome to Medical Equipment Store",
                text: `Hi ${user.name},

Your account has been created successfully.

Thank you for joining Medical Equipment Store.`,
                html: `
                    <h2>Welcome, ${safeName}!</h2>
                    <p>Your account has been created successfully.</p>
                    <p>Thank you for joining Medical Equipment Store.</p>
                `,
            });
        } catch (emailError) {
            console.error("Welcome email failed:", emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        console.error("Signup error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create account. Please try again.",
        });
    }
});

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password +tokenVersion");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = createAuthToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in. Please try again.",
        });
    }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user.userId,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
        },
    });
});

// PUT /api/auth/profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body || {};
        const updates = {};

        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                name.trim().length < 2 ||
                name.trim().length > 80
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 2 and 80 characters.",
                });
            }

            updates.name = name.trim();
        }

        if (phone !== undefined) {
            if (typeof phone !== "string" || phone.length > 25) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid phone number.",
                });
            }

            updates.phone = phone.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide a name or phone number to update.",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true },
        ).select("_id name email phone role");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Profile update error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile.",
        });
    }
});

// PATCH /api/auth/change-password
router.patch("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};

        if (
            typeof currentPassword !== "string" ||
            !currentPassword ||
            typeof newPassword !== "string" ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Current and new passwords are required.",
            });
        }

        if (newPassword.length < 8 || newPassword.length > 128) {
            return res.status(400).json({
                success: false,
                message: "New password must be between 8 and 128 characters.",
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must differ from the current password.",
            });
        }

        const user = await User.findById(req.user.userId).select(
            "+password +tokenVersion +resetPasswordToken +resetPasswordExpires",
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);

        // Invalidate existing JWTs and password-reset links.
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: "Your password has been changed",
                text:
                    "Your account password has been changed. " +
                    "If this wasn't you, contact support.",
                html:
                    "<p>Your account password has been changed. " +
                    "If this wasn't you, contact support.</p>",
            });
        } catch (emailError) {
            console.error("Password notification failed:", emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Password changed successfully. Please log in again.",
        });
    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to change password.",
        });
    }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
    const genericResponse = {
        success: true,
        message:
            "If an account exists for that email, a password reset link will be sent.",
    };

    try {
        const { email } = req.body || {};

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return res.status(200).json(genericResponse);
        }

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(200).json(genericResponse);
        }

        const rawToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = hashResetToken(rawToken);
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const frontendUrl = (
            process.env.FRONTEND_URL || "http://localhost:5173"
        ).replace(/\/+$/, "");

        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

        try {
            const safeName = escapeHtml(user.name);
            const safeResetUrl = escapeHtml(resetUrl);

            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Hi ${user.name},

Open this link within 15 minutes to reset your password:
${resetUrl}

If you did not request this, ignore this email.`,
                html: `
                    <h2>Password Reset</h2>
                    <p>Hi ${safeName},</p>
                    <p>This link expires in 15 minutes.</p>
                    <p><a href="${safeResetUrl}">Reset your password</a></p>
                    <p>If you did not request this, ignore this email.</p>
                `,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            console.error("Reset email failed:", emailError.message);
        }

        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error("Forgot password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to process your request. Please try again.",
        });
    }
});

// POST /api/auth/reset-password
router.post("/reset-password", passwordResetLimiter, async (req, res) => {
    try {
        const { token, newPassword } = req.body || {};

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token) ||
            typeof newPassword !== "string" ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid token and new password are required.",
            });
        }

        if (newPassword.length < 8 || newPassword.length > 128) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 128 characters.",
            });
        }

        const user = await User.findOne({
            resetPasswordToken: hashResetToken(token),
            resetPasswordExpires: { $gt: new Date() },
        }).select(
            "+password +tokenVersion +resetPasswordToken +resetPasswordExpires",
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or expired. Request a new one.",
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);

        // Invalidate existing JWTs and consume the reset link.
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: "Your password has been reset",
                text:
                    "Your password was reset successfully. " +
                    "If this wasn't you, contact support.",
                html:
                    "<p>Your password was reset successfully. " +
                    "If this wasn't you, contact support.</p>",
            });
        } catch (emailError) {
            console.error("Reset notification failed:", emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please log in again.",
        });
    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password. Please try again.",
        });
    }
});

module.exports = router;
