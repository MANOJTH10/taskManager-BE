const express = require("express");
const { registeruser, loginuser, getuserProfile, updateuserProfile } = require("../controllers/authControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registeruser);               //.Register user
router.post("/login", loginuser);                     //.Login user
router.get("/profile", protect, getuserProfile);     //.Get user profile
router.put("/profile", protect, updateuserProfile);  //.Update user profile

module.exports = router;