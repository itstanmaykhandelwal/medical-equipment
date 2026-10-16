const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Authorization header must contain a Bearer token.
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in.",
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing.",
            });
        }

        // 2. JWT secret must be configured on the server.
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured.",
            });
        }

        // 3. Verify token signature and expiration.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Require the user ID and token version used by login.
        if (
            !decoded ||
            typeof decoded.userId !== "string" ||
            !mongoose.isValidObjectId(decoded.userId) ||
            !Number.isInteger(decoded.tokenVersion) ||
            decoded.tokenVersion < 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token. Please log in again.",
            });
        }

        // 5. Confirm that the user still exists.
        const user = await User.findById(decoded.userId)
            .select("_id name email phone role +tokenVersion")
            .lean();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found. Please log in again.",
            });
        }

        // 6. Check the session version against the database.
        const currentTokenVersion = user.tokenVersion ?? 0;

        if (decoded.tokenVersion !== currentTokenVersion) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }

        // 7. Attach verified user information to the request.
        req.user = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        return next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError" ||
            error.name === "CastError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please log in again.",
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
        });
    }
};

module.exports = authMiddleware;
