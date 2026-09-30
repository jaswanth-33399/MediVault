const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/Medicine");
const prescriptionRoutes = require("./routes/prescription");
const prescriptionMedicineRoutes = require("./routes/prescriptionMedicine");
const myMedicineRoutes = require("./routes/myMedicine");

const app = express();

const PORT = 5000;

// Middleware
// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/prescription-medicines", prescriptionMedicineRoutes);
app.use("/api/my-medicines", myMedicineRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// Test route
app.get("/", (req, res) => {
    res.send("MediVault server is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`MediVault server running on http://localhost:${PORT}`);
});