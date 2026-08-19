const express = require("express");
const router = express.Router();
const { register ,login ,getProfile } = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile" , authMiddleware ,getProfile);

router.post("/register", register);
router.post("/login" ,login);
module.exports = router;