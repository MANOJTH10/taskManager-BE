const jwt = require("jsonwebtoken");
const user = require("../models/user");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];                                    // Extract token from "Bearer <token>"
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select("-password"); // Attach user to request, excluding password
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Token failed", error: error.message });
    }
};

// Middleware for Admin-only access
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {                             // Assuming user model has a 'role' field 
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
};
module.exports = { protect, admin };