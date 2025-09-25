const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign( { id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" } );
};  

//@desc    Register a new user
//@route   POST /api/auth/register
//@access  Public
const registeruser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, admineInviteCode } = 
        req.body;

        // Check if user already exists
        const userExists = await user.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "user already exists" });
        }

        //Determine user role: Admine if correct token is provided, otherwise Member
        let role = "member";
        if (
            admineInviteToken &&
            admineInviteToken === process.env.ADMINE_INVITE_TOKEN
        ) {
            role = "admine";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await user.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

//@desc    Login user
//@route   POST /api/auth/login
//@access  Public
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await user.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

//@desc    Get user profile
//@route   GET /api/auth/profile
//@access  Private
const getuserProfile = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

//@desc    Update user profile
//@route   PUT /api/auth/profile
//@access  Private
const updateuserProfile = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

module.exports = { registeruser, loginuser, getuserProfile, updateuserProfile};