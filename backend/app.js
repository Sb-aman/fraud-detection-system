const transactionRoutes = require("./routes/transactionRoute");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

// Database Connection
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);



app.get("/", (req, res) => {
    res.send("Fraud Detection API Running...");
});


module.exports = app;