const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { loginLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

// Admin login
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured.",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password +tokenVersion");

        if (!user || user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials.",
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials.",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                tokenVersion: user.tokenVersion ?? 0,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in as admin.",
        });
    }
});

// Protected admin dashboard with real database statistics
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const [
            totalProducts,
            totalCustomers,
            stockStats,
            orderStats,
            recentOrders,
            chartOrders,
        ] = await Promise.all([
            Product.countDocuments(),

            Order.distinct("user", {
                user: { $ne: null },
                orderStatus: { $ne: "cancelled" },
            }).then((customerIds) => customerIds.length),

            Product.aggregate([
                {
                    $group: {
                        _id: null,
                        totalStock: {
                            $sum: { $ifNull: ["$stock", 0] },
                        },
                        lowStockProducts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $gt: [
                                                    { $ifNull: ["$stock", 0] },
                                                    0,
                                                ],
                                            },
                                            {
                                                $lte: [
                                                    { $ifNull: ["$stock", 0] },
                                                    5,
                                                ],
                                            },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        outOfStockProducts: {
                            $sum: {
                                $cond: [
                                    { $lte: [{ $ifNull: ["$stock", 0] }, 0] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        pendingOrders: {
                            $sum: {
                                $cond: [
                                    {
                                        $in: [
                                            "$orderStatus",
                                            [
                                                "placed",
                                                "confirmed",
                                                "processing",
                                            ],
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        totalSales: {
                            $sum: {
                                $cond: [
                                    { $ne: ["$orderStatus", "cancelled"] },
                                    { $ifNull: ["$total", 0] },
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("user", "name email")
                .select("user total orderStatus paymentStatus createdAt"),

            Order.find({
                createdAt: { $gte: sevenDaysAgo },
                orderStatus: { $ne: "cancelled" },
            }).select("total createdAt"),
        ]);

        const stock = stockStats[0] || {};
        const orders = orderStats[0] || {};

        // Prepare seven days of chart data, including days with zero sales.
        const salesChart = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);

            const dateKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            const dailyOrders = chartOrders.filter((order) => {
                const orderDate = new Date(order.createdAt);

                const orderKey = [
                    orderDate.getFullYear(),
                    String(orderDate.getMonth() + 1).padStart(2, "0"),
                    String(orderDate.getDate()).padStart(2, "0"),
                ].join("-");

                return orderKey === dateKey;
            });

            salesChart.push({
                date: dateKey,
                label: date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                }),
                sales: dailyOrders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                ),
                orders: dailyOrders.length,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalCustomers,
                totalOrders: orders.totalOrders || 0,
                pendingOrders: orders.pendingOrders || 0,
                totalStock: stock.totalStock || 0,
                lowStockProducts: stock.lowStockProducts || 0,
                outOfStockProducts: stock.outOfStockProducts || 0,
                totalSales: orders.totalSales || 0,
                salesChart,
                recentOrders,
            },
        });
    } catch (error) {
        console.error("Admin dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard statistics.",
        });
    }
});

// GET /api/admin/customers
router.get("/customers", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users, orderStats] = await Promise.all([
            User.find({ role: { $ne: "admin" } })
                .select("name email phone role createdAt")
                .sort({ createdAt: -1 })
                .lean(),

            Order.aggregate([
                {
                    $match: {
                        user: { $ne: null },
                    },
                },
                {
                    $group: {
                        _id: "$user",
                        orderCount: { $sum: 1 },
                        totalSpent: {
                            $sum: {
                                $cond: [
                                    { $ne: ["$orderStatus", "cancelled"] },
                                    { $ifNull: ["$total", 0] },
                                    0,
                                ],
                            },
                        },
                        lastOrderAt: { $max: "$createdAt" },
                    },
                },
            ]),
        ]);

        const statsByUser = new Map(
            orderStats.map((item) => [String(item._id), item]),
        );

        const customers = users.map((user) => {
            const stats = statsByUser.get(String(user._id));

            return {
                _id: user._id,
                name: user.name || "Unnamed customer",
                email: user.email || "",
                phone: user.phone || "",
                createdAt: user.createdAt || null,
                orderCount: stats?.orderCount || 0,
                totalSpent: stats?.totalSpent || 0,
                lastOrderAt: stats?.lastOrderAt || null,
            };
        });

        return res.status(200).json({
            success: true,
            customers,
            totalCustomers: customers.length,
        });
    } catch (error) {
        console.error("Admin customers error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch customers.",
        });
    }
});

module.exports = router;
