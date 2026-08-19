const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check existing user
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // validate email and password
        if (!email.includes("@")) {
    return res.status(400).json({
        success: false,
        message: "Invalid email format"
    });
}

if (password.length < 6) {
    return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
    });
}

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate account number
        const accountNumber = "ACC" + Date.now();

        // Insert user
        await db.query(
            "INSERT INTO users(name,email,password,account_number) VALUES(?,?,?,?)",
            [name, email, hashedPassword, accountNumber]
        );

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!email.includes("@")) {
    return res.status(400).json({
        success: false,
        message: "Invalid email format"
    });
}

        // Find user
        const [result] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = result[0];



        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                accountNumber: user.account_number
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ================= PROFILE =================

const getProfile = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const [result] = await db.query(
            `SELECT id, name, email, account_number, balance, created_at
             FROM users
             WHERE email = ?`,
            [userEmail]
        );

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = result[0];

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                accountNumber: user.account_number,
                balance: user.balance,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};28
