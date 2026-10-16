const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { sendEmail } = require("../utils/emailService");

const {
    buildOrderConfirmationEmail,
    buildOrderStatusEmail,
    buildOrderCancellationEmail,
} = require("../utils/emailTemplates");

const router = express.Router();

const SHIPPING_FEE = 0;

const allowedStatuses = [
    "placed",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
];

const cancellableStatuses = ["placed", "confirmed"];

// Escape dynamic content before inserting it into HTML emails.
const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character],
    );

const formatCurrency = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

// Send an email without making a successful order operation fail.
const safelySendEmail = async (options, context) => {
    try {
        await sendEmail(options);
    } catch (error) {
        console.error(`${context} email failed:`, error.message);
    }
};

// Restore stock if order creation fails or a customer cancels.
const restoreStock = async (items) => {
    const results = await Promise.allSettled(
        items.map(({ productId, quantity }) =>
            Product.updateOne(
                { _id: productId },
                { $inc: { stock: quantity } },
            ),
        ),
    );

    const failed = results.some(
        (result) =>
            result.status === "rejected" || result.value?.matchedCount !== 1,
    );

    if (failed) {
        console.error(
            "CRITICAL: Stock restoration incomplete. Manual reconciliation required.",
        );
    }

    return !failed;
};

// POST /api/orders — place an order
router.post("/", authMiddleware, async (req, res) => {
    const reservedProducts = [];

    try {
        const { items, shippingAddress, paymentMethod } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        if (items.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Too many different products in one order.",
            });
        }

        if (!["cod", "online"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method.",
            });
        }

        const requiredAddressFields = [
            "fullName",
            "phone",
            "addressLine",
            "city",
            "state",
            "postalCode",
        ];

        if (
            !shippingAddress ||
            typeof shippingAddress !== "object" ||
            requiredAddressFields.some(
                (field) =>
                    typeof shippingAddress[field] !== "string" ||
                    !shippingAddress[field].trim(),
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required.",
            });
        }

        // Validate quantities and combine duplicate product IDs.
        const quantities = new Map();

        for (const item of items) {
            if (
                !item ||
                typeof item.productId !== "string" ||
                !mongoose.isValidObjectId(item.productId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product or quantity.",
                });
            }

            const id = item.productId;
            const quantity = (quantities.get(id) || 0) + item.quantity;

            if (quantity > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum quantity per product is 100.",
                });
            }

            quantities.set(id, quantity);
        }

        const productIds = [...quantities.keys()];

        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true,
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more products are unavailable.",
            });
        }

        // Always calculate prices from the database.
        const orderItems = [];
        let subtotal = 0;

        for (const product of products) {
            const quantity = quantities.get(product._id.toString());

            const productImages = Array.isArray(product.images)
                ? product.images.filter(Boolean)
                : [];

            const primaryImage = productImages[0] || product.image || "";

            orderItems.push({
                product: product._id,
                name: product.name,
                brand: product.brand || "",
                image: primaryImage,
                images: productImages.length
                    ? productImages
                    : primaryImage
                      ? [primaryImage]
                      : [],
                price: product.price,
                quantity,
            });

            subtotal += product.price * quantity;
        }

        const shippingFee = SHIPPING_FEE;
        const total = subtotal + shippingFee;

        // Atomically reserve stock for each product.
        for (const item of orderItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    isActive: true,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: { stock: -item.quantity },
                },
                { new: true },
            );

            if (!updatedProduct) {
                await restoreStock(reservedProducts);

                return res.status(409).json({
                    success: false,
                    message: `Insufficient stock or unavailable product: ${item.name}.`,
                });
            }

            reservedProducts.push({
                productId: item.product,
                quantity: item.quantity,
            });
        }

        let order;

        try {
            order = await Order.create({
                user: req.user.userId,
                items: orderItems,
                shippingAddress: {
                    fullName: shippingAddress.fullName.trim(),
                    phone: shippingAddress.phone.trim(),
                    addressLine: shippingAddress.addressLine.trim(),
                    city: shippingAddress.city.trim(),
                    state: shippingAddress.state.trim(),
                    postalCode: shippingAddress.postalCode.trim(),
                },
                subtotal,
                shippingFee,
                total,
                paymentMethod,
                paymentStatus: "pending",
                orderStatus: "placed",
            });
        } catch (error) {
            await restoreStock(reservedProducts);
            throw error;
        }

        // Send the Medical Blue order confirmation email.
        try {
            const user = await User.findById(req.user.userId).select(
                "name email",
            );

            if (user) {
                const itemText = orderItems
                    .map(
                        (item) =>
                            `${item.name} x ${item.quantity} — ${formatCurrency(
                                item.price * item.quantity,
                            )}`,
                    )
                    .join("\n");

                await safelySendEmail(
                    {
                        to: user.email,
                        subject: `Order Confirmation #${order._id}`,
                        text: `Hi ${user.name},

Your order has been placed successfully.

Order ID: ${order._id}

${itemText}

Subtotal: ${formatCurrency(subtotal)}
Shipping: ${formatCurrency(shippingFee)}
Total: ${formatCurrency(total)}

Payment method: ${paymentMethod.toUpperCase()}
Payment status: Pending
Order status: Placed

Thank you for shopping with us!`,
                        html: buildOrderConfirmationEmail({
                            name: user.name,
                            orderId: order._id,
                            items: orderItems,
                            subtotal,
                            shippingFee,
                            total,
                            paymentMethod,
                            paymentStatus: order.paymentStatus,
                            orderStatus: order.orderStatus,
                            shippingAddress: order.shippingAddress,
                        }),
                    },
                    "Order confirmation",
                );
            }
        } catch (error) {
            console.error(
                "Could not prepare order confirmation email:",
                error.message,
            );
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to place order.",
        });
    }
});

// GET /api/orders/my-orders
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Fetch customer orders error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders.",
        });
    }
});

// ADMIN: GET /api/orders/admin/all
// Keep before GET /:id.
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email");

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Admin fetch orders error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch all orders.",
        });
    }
});

// ADMIN: PATCH /api/orders/admin/:id/status
router.patch(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { orderStatus } = req.body || {};

            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order ID.",
                });
            }

            if (!allowedStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status update.",
                });
            }

            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            if (["cancelled", "delivered"].includes(order.orderStatus)) {
                return res.status(409).json({
                    success: false,
                    message: "This order status cannot be changed.",
                });
            }

            if (
                order.paymentMethod === "online" &&
                order.paymentStatus !== "paid" &&
                orderStatus === "delivered"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Online payment must be verified before delivery.",
                });
            }

            const previousStatus = order.orderStatus;

            order.orderStatus = orderStatus;
            await order.save();

            // Email only when the status actually changes.
            if (previousStatus !== orderStatus) {
                try {
                    const user = await User.findById(order.user).select(
                        "name email",
                    );

                    if (user) {
                        await safelySendEmail(
                            {
                                to: user.email,
                                subject: `Order Update #${order._id}`,
                                text: `Hi ${user.name},

Your order status has been updated.

Order ID: ${order._id}
Previous status: ${previousStatus}
New status: ${orderStatus}

Thank you for shopping with us!`,
                                html: buildOrderStatusEmail({
                                    name: user.name,
                                    orderId: order._id,
                                    previousStatus,
                                    orderStatus,
                                }),
                            },
                            "Order status update",
                        );
                    }
                } catch (error) {
                    console.error(
                        "Could not prepare order status email:",
                        error.message,
                    );
                }
            }

            return res.status(200).json({
                success: true,
                message: "Order status updated successfully.",
                order,
            });
        } catch (error) {
            console.error("Admin update order error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to update order status.",
            });
        }
    },
);

// GET /api/orders/:id — owner or admin only
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        const isOwner = order.user.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this order.",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Fetch order error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch order.",
        });
    }
});

// PATCH /api/orders/:id/cancel
router.patch("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId,
                orderStatus: { $in: cancellableStatuses },
                paymentStatus: { $ne: "paid" },
            },
            {
                $set: { orderStatus: "cancelled" },
            },
            { new: true },
        );

        if (!order) {
            const existingOrder = await Order.findOne({
                _id: req.params.id,
                user: req.user.userId,
            }).select("_id");

            if (!existingOrder) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            return res.status(409).json({
                success: false,
                message:
                    "Order cannot be cancelled. It may already be cancelled, paid, or processing.",
            });
        }

        const restorationSucceeded = await restoreStock(
            order.items.map((item) => ({
                productId: item.product,
                quantity: item.quantity,
            })),
        );

        if (!restorationSucceeded) {
            return res.status(500).json({
                success: false,
                message:
                    "Order was cancelled, but stock restoration needs reconciliation.",
            });
        }

        // Send the Medical Blue cancellation email.
        try {
            const user = await User.findById(order.user).select("name email");

            if (user) {
                await safelySendEmail(
                    {
                        to: user.email,
                        subject: `Order Cancelled #${order._id}`,
                        text: `Hi ${user.name},

Your order ${order._id} has been cancelled.

If you have any questions, please contact our support team.`,
                        html: buildOrderCancellationEmail({
                            name: user.name,
                            orderId: order._id,
                        }),
                    },
                    "Order cancellation",
                );
            }
        } catch (error) {
            console.error(
                "Could not prepare order cancellation email:",
                error.message,
            );
        }

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully.",
            order,
        });
    } catch (error) {
        console.error("Cancel order error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel order.",
        });
    }
});

module.exports = router;
