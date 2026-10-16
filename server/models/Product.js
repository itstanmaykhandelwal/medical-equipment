const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        brand: {
            type: String,
            trim: true,
            default: "",
            maxlength: 100,
        },
        description: {
            type: String,
            default: "",
            maxlength: 5000,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        oldPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        image: {
            type: String,
            default: "",
        },
        images: {
            type: [String],
            default: [],
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
