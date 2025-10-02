const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token from user id
const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

//@desc    Register a new user
//@route   POST /api/auth/register
//@access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Determine user role: Admin if correct token is provided, otherwise member
        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (map profileImageUrl -> profileImage)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImage: profileImageUrl || null,
            role,
        });

        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImage,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc    Login user
//@route   POST /api/auth/login
//@access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImage,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc    Get user profile
//@route   GET /api/auth/profile
//@access  Private
const getUserProfile = async (req, res) => {
    try {
        // protect middleware attaches user id to req.user
        if (!req.user) return res.status(404).json({ message: "User not found" });

        // Re-fetch a safe copy without password
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImage,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc    Update user profile
//@route   PUT /api/auth/profile
//@access  Private
/*
    Recommended approach for updating a user (why we pick option 2):

    - Fetch a writable Mongoose document for the authenticated user and update only
        whitelisted fields. This is concise and ensures you can use document methods
        (eg. save(), middleware hooks).
    - Avoid mass-assignment from req.body (don't copy req.body directly onto the doc).
    - Explicitly handle password hashing if a new password is provided.
    - Use explicit checks (typeof) when updating fields so falsy but valid values
        (empty string, false) are handled intentionally.

    This file implements the safe, corrected pattern: load the doc via
    `await User.findById(req.user._id)`, update allowed fields, hash password when
    present, then save and return the sanitized response.

    (Do NOT use `findByIdAndUpdate(..., { new: true })` if you rely on pre/post
    save middleware like password hashing or audit hooks.)

*/
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req,user.id);
        if (!user) {
        return res.status(404).json({message: "user not found"});
}

user.name = req.body.name || user.name;
user.email = req.body.email || user.email;

if (req.body.password) {
   const salt = await bcrypt.genSalt(10);
   user.password =await bcrypt.hash(req.body.password, salt);
}

const updatedUser = await user.save();

res.json({
 _id: updatedUser._id,
 name: updatedUser.name,
 email: updatedUser.email,
 role: updatedUser.role,
 token: generateToken(updatedUser._id),
});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };