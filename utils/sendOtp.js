// utils/sendOTP.js
const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // your email
            pass: process.env.EMAIL_PASS  // your app password
        }
    });

    await transporter.sendMail({
        from: `"Zameen Sale" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP for registration is: ${otp}`
    });
};

module.exports = sendOTP;
