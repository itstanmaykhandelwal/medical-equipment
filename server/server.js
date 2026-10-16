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

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without Origin, e.g. local scripts.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
    }),
);

app.use(express.json({ limit: "1mb" }));

// Serve uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health checks
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Medical Equipment API is running!",
    });
});

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

// Start server after database connection
const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in server/.env");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in server/.env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
