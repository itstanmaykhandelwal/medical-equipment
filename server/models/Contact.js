const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: ["new", "in-progress", "resolved"],
            default: "new",
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Contact", contactSchema);
