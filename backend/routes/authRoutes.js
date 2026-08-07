const express = require("express");
const router = express.Router();
const { register ,login } = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile" , authMiddleware , (req,res) => {
    res.status(200).json({
        success : true,
        message : "Protected Route",
        user : req.user
    });
});

router.post("/register", register);
router.post("/login" ,login);
module.exports = router;