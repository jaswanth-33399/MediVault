const express = require("express");
const MyMedicine = require("../models/MyMedicine");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a medicine to My Medicines
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            medicineId,
            quantity,
            expiryDate,
            source,
            notes
        } = req.body;

        const medicine = await Medicine.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        const myMedicine = new MyMedicine({
            userId: req.user.userId,
            medicineId,
            quantity,
            expiryDate,
            source,
            notes
        });

        await myMedicine.save();

        res.status(201).json({
            message: "Medicine added to My Medicines successfully",
            myMedicine
        });

    } catch (error) {
        console.error("Add my medicine error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Get all medicines belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const medicines = await MyMedicine.find({
            userId: req.user.userId
        })
            .populate("medicineId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            medicines
        });

    } catch (error) {
        console.error("Get my medicines error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;
