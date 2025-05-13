// models/TempUser.js
const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    phone: String,
    email: String,
    password: String,
    role: String,
    otp: String,
    otpExpiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model("TempUser", tempUserSchema);
