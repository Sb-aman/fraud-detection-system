const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    console.log(req.headers);
    console.log("Authorization:", req.headers.authorization);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Denied"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = authMiddleware;