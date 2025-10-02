const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImage: { type: String, default:null },
        role: { type: String, enum: ["admin", "member"], default: "member" }, // Role-based access
    },
    { timestamps: true }
);   

module.exports = mongoose.models.user || mongoose.model("user", userSchema);