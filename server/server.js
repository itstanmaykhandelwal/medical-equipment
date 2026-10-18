const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    ...(process.env.CORS_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean),
];

app.use(
    cors({
        origin: (origin, callback) => {
            console.log("CORS origin received:", origin);
            console.log("Allowed origins:", allowedOrigins);

            if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                return callback(null, true);
            }

            return callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
    }),
);

app.use(express.json({ limit: "1mb" }));

// Existing uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root health check (does not require database)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Medical Equipment API is running!",
    });
});

// Reuse the MongoDB connection across requests
let connectionPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGODB_URI)
            .catch((error) => {
                connectionPromise = null;
                throw error;
            });
    }

    await connectionPromise;
};

// Connect to MongoDB before API requests
app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection error:", error.message);

        res.status(503).json({
            success: false,
            message: "Database connection unavailable.",
        });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        database:
            mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

// Not found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found.",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("API error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.message === "Origin not allowed by CORS" ? 403 : 500;

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 403
                ? "Request origin is not allowed."
                : "Internal server error.",
    });
});

// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Vercel uses the exported Express application
module.exports = app;
