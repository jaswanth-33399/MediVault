const express = require("express");
const Prescription = require("../models/Prescription");
const PrescriptionMedicine = require("../models/PrescriptionMedicine");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new prescription
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            prescriptionDate,
            doctorName,
            notes
        } = req.body;

        const prescription = new Prescription({
            userId: req.user.userId,
            prescriptionDate,
            doctorName,
            notes
        });

        await prescription.save();

        res.status(201).json({
            message: "Prescription created successfully",
            prescription
        });

    } catch (error) {
        console.error("Create prescription error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Get all prescriptions for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({
            userId: req.user.userId
        }).sort({ prescriptionDate: -1 });

        res.status(200).json({
            prescriptions
        });

    } catch (error) {
        console.error("Get prescriptions error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Get one prescription with its medicines
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const prescription = await Prescription.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        const medicines = await PrescriptionMedicine.find({
            prescriptionId: prescription._id
        }).populate("medicineId");

        res.status(200).json({
            prescription,
            medicines
        });

    } catch (error) {
        console.error("Get prescription details error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;