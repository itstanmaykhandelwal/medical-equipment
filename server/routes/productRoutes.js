const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const MAX_IMAGES = 10;

const createSlug = (value) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const validateProduct = (data, isUpdate = false) => {
    if (!isUpdate && (!data.name?.trim() || !data.category?.trim())) {
        return "Product name and category are required.";
    }

    if (
        data.name !== undefined &&
        (typeof data.name !== "string" || !data.name.trim())
    ) {
        return "Product name must be a non-empty string.";
    }

    if (
        data.category !== undefined &&
        (typeof data.category !== "string" || !data.category.trim())
    ) {
        return "Category must be a non-empty string.";
    }

    if (
        data.price !== undefined &&
        (typeof data.price !== "number" ||
            !Number.isFinite(data.price) ||
            data.price < 0)
    ) {
        return "Price must be a valid non-negative number.";
    }

    if (
        data.oldPrice !== undefined &&
        data.oldPrice !== null &&
        (typeof data.oldPrice !== "number" ||
            !Number.isFinite(data.oldPrice) ||
            data.oldPrice < 0)
    ) {
        return "Old price must be a valid non-negative number.";
    }

    if (
        data.stock !== undefined &&
        (!Number.isInteger(data.stock) || data.stock < 0)
    ) {
        return "Stock must be a non-negative integer.";
    }

    if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
        return "isActive must be true or false.";
    }

    for (const field of ["brand", "description", "image"]) {
        if (data[field] !== undefined && typeof data[field] !== "string") {
            return `${field} must be a string.`;
        }
    }

    if (data.images !== undefined) {
        if (!Array.isArray(data.images)) {
            return "Images must be an array.";
        }

        if (data.images.length > MAX_IMAGES) {
            return `A maximum of ${MAX_IMAGES} images is allowed.`;
        }

        if (
            data.images.some(
                (image) =>
                    typeof image !== "string" || image.trim().length === 0,
            )
        ) {
            return "Every image must be a non-empty string.";
        }
    }

    return null;
};

const allowedFields = [
    "name",
    "description",
    "brand",
    "category",
    "price",
    "oldPrice",
    "image",
    "images",
    "stock",
    "isActive",
];

// GET all active products with search and pagination
router.get("/", async (req, res) => {
    try {
        const { search, category, brand, page = 1, limit = 12 } = req.query;

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

        const filter = { isActive: true };

        if (search && search.trim()) {
            const escapedSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { brand: { $regex: escapedSearch, $options: "i" } },
                {
                    description: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
            ];
        }

        if (category && category.trim()) {
            filter.category = category.trim();
        }

        if (brand && brand.trim()) {
            filter.brand = brand.trim();
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean(),

            Product.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            products,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("Fetch products error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch products.",
        });
    }
});

// GET all products for admin, including inactive products
// Keep this route before /:identifier.
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Admin fetch products error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch admin products.",
        });
    }
});

// GET one active product by ID or slug
router.get("/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;

        const conditions = [{ slug: identifier.toLowerCase() }];

        if (mongoose.isValidObjectId(identifier)) {
            conditions.push({ _id: identifier });
        }

        const product = await Product.findOne({
            isActive: true,
            $or: conditions,
        }).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Backward compatibility for products with only `image`.
        if (!Array.isArray(product.images) || product.images.length === 0) {
            product.images = product.image ? [product.image] : [];
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Fetch product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch product.",
        });
    }
});

// CREATE product — admin only
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const error = validateProduct(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }

        const slugSource = req.body.slug ?? req.body.name;

        if (typeof slugSource !== "string") {
            return res.status(400).json({
                success: false,
                message: "Product slug must be a string.",
            });
        }

        const slug = createSlug(slugSource);

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "A valid product name or slug is required.",
            });
        }

        const productData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                productData[field] = req.body[field];
            }
        });

        // Keep the first image in the legacy field too.
        if (
            Array.isArray(productData.images) &&
            productData.images.length > 0
        ) {
            productData.image = productData.images[0];
        }

        const product = await Product.create({
            ...productData,
            slug,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A product with this slug already exists.",
            });
        }

        console.error("Create product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create product.",
        });
    }
});

// UPDATE product — admin only
router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (req.body.slug !== undefined || req.body.name !== undefined) {
            const slugSource = req.body.slug ?? req.body.name;

            if (typeof slugSource !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Product slug must be a string.",
                });
            }

            const slug = createSlug(slugSource);

            if (!slug) {
                return res.status(400).json({
                    success: false,
                    message: "A valid product name or slug is required.",
                });
            }

            updates.slug = slug;
        }

        // If images were changed, sync the legacy main image field.
        if (Array.isArray(updates.images)) {
            updates.image = updates.images[0] || "";
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid product fields provided.",
            });
        }

        const error = validateProduct(updates, true);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A product with this slug already exists.",
            });
        }

        console.error("Update product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update product.",
        });
    }
});

// DELETE product — admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Delete product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete product.",
        });
    }
});

module.exports = router;
