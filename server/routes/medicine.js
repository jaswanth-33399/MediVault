const express = require("express");
const Medicine = require("../models/Medicine");

const router = express.Router();

// Search medicines by name
router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                message: "Medicine name is required"
            });
        }

        const medicines = await Medicine.find({
            name: { $regex: name, $options: "i" }
        }).sort({ name: 1 });

        res.status(200).json({
            medicines
        });

    } catch (error) {
        console.error("Search medicines error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Get all medicines
router.get("/", async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });

        res.status(200).json({
            medicines
        });

    } catch (error) {
        console.error("Get medicines error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Add a new medicine
router.post("/", async (req, res) => {
    try {
        const { name, commonUses, description } = req.body;

        const medicine = new Medicine({
            name,
            commonUses,
            description
        });

        await medicine.save();

        res.status(201).json({
            message: "Medicine added successfully",
            medicine
        });

    } catch (error) {
        console.error("Add medicine error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;