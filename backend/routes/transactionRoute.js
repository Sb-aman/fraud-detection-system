const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    sendMoney,
    transactionHistory
} = require("../controllers/transactionController");

router.post("/send", authMiddleware, sendMoney);

router.get("/history", authMiddleware, transactionHistory);

module.exports = router;