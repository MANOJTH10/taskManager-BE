const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userControllers");

const router = express.Router();

// User Management Routes
// User Management Routes
// Simple ping for router mount tests
router.get('/ping', (req, res) => res.json({ ok: true, route: '/api/users/ping' }));
router.get("/", protect, adminOnly, getUsers);               //.Get all users (Admin only)
router.get("/:id", protect, getUserById);                    //.Get user by ID

module.exports = router;