const mongoose = require("mongoose");

const prescriptionMedicineSchema = new mongoose.Schema(
    {
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prescription",
            required: true
        },

        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true
        },

        dosage: {
            type: String,
            required: true,
            trim: true
        },

        frequency: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        instructions: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "PrescriptionMedicine",
    prescriptionMedicineSchema
);