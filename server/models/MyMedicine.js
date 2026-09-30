const mongoose = require("mongoose");

const myMedicineSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        expiryDate: {
            type: Date
        },

        isActive: {
            type: Boolean,
            default: true
        },

        source: {
            type: String,
            enum: ["prescription", "purchased", "other"],
            default: "other"
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("MyMedicine", myMedicineSchema);