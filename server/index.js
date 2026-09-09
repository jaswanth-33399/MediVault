const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

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