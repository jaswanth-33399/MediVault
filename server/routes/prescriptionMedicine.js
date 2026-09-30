const express = require("express");
const PrescriptionMedicine = require("../models/PrescriptionMedicine");
const Prescription = require("../models/Prescription");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add medicine to a prescription
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            prescriptionId,
            medicineId,
            dosage,
            frequency,
            duration,
            quantity,
            instructions
        } = req.body;

        const prescription = await Prescription.findOne({
            _id: prescriptionId,
            userId: req.user.userId
        });

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        const prescriptionMedicine = new PrescriptionMedicine({
            prescriptionId,
            medicineId,
            dosage,
            frequency,
            duration,
            quantity,
            instructions
        });

        await prescriptionMedicine.save();

        res.status(201).json({
            message: "Medicine added to prescription successfully",
            prescriptionMedicine
        });

    } catch (error) {
        console.error("Add prescription medicine error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;