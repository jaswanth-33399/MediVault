const express = require("express");
const MyMedicine = require("../models/MyMedicine");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add medicine to My Medicines
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

        // Check if the user already has this medicine
        const existingMedicine = await MyMedicine.findOne({
            userId: req.user.userId,
            medicineId
        });

        if (existingMedicine) {
            existingMedicine.quantity += quantity;

            if (expiryDate) {
                existingMedicine.expiryDate = expiryDate;
            }

            if (source) {
                existingMedicine.source = source;
            }

            if (notes) {
                existingMedicine.notes = notes;
            }

            await existingMedicine.save();

            return res.status(200).json({
                message: "Medicine quantity updated successfully",
                myMedicine: existingMedicine
            });
        }

        // Create a new medicine record if user does not have it
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

        const medicinesWithStatus = medicines.map((medicine) => ({
            ...medicine.toObject(),
            stockStatus:
                medicine.quantity <= medicine.lowStockThreshold
                    ? "low"
                    : "normal"
        }));

        res.status(200).json({
            medicines: medicinesWithStatus
        });

    } catch (error) {
        console.error("Get my medicines error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Use a medicine and decrease its quantity
router.put("/:id/use", authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        const myMedicine = await MyMedicine.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!myMedicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        if (quantity > myMedicine.quantity) {
            return res.status(400).json({
                message: "Not enough medicine in stock"
            });
        }

        myMedicine.quantity -= quantity;

        await myMedicine.save();

        res.status(200).json({
            message: "Medicine usage recorded successfully",
            myMedicine
        });

    } catch (error) {
        console.error("Use medicine error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;