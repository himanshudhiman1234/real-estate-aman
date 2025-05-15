const User = require("../models/User")
const Role =require("./../models/Role")
const bcrypt = require("bcrypt")
const sendOTP = require("../utils/sendOtp")
const TempUser = require("../models/tempUser")
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    try {
        const roles = await Role.find({role_name:{$ne:"admin"}});
        res.render("register", { roles });
    } catch (err) {
        console.error("Error fetching roles:", err);
        res.status(500).send("Internal Server Error");
    }
};


const postRegister = async (req, res) => {
    try {
        const { phone, email, password, role } = req.body;
        const roles = await Role.find({role_name:{$ne:"admin"}});

        const existingEmail = await User.findOne({email:email});
        console.log(existingEmail)
        if(existingEmail){
          return res.render("register", {roles, error: "User already registered with this email" });

        }
        if(!phone||!email||!password){
            // res.status(400).send(error:"Something went wrong.");
            return res.render("register", {roles, error: "All fields are required" });

          }

           
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

          const tempUser = await TempUser.findOne({email})

          if(tempUser){
            tempUser.phone = phone;
            tempUser.password = hashPassword;
            tempUser.role = role;
            tempUser.otp = otp;
            tempUser.otpExpiresAt = otpExpiresAt;
            await tempUser.save();
          }else{

        // Save temp user
        await TempUser.create({
            phone,
            email,
            password: hashPassword,
            role,
            otp,
            otpExpiresAt
        });
          }

        // Send OTP
        await sendOTP(email, otp);

        res.render("otpform", { email }); // show OTP input page

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            return res.render("otpform", { email, error: "No registration found." });
        }

        if (tempUser.otp !== otp) {
            return res.render("otpform", { email, error: "Your OTP is incorrect." });
        }

        if (tempUser.otpExpiresAt < new Date()) {
            return res.render("otpform", { email, error: "OTP expired." });
        }

        // Save to main User DB
        const { phone, password, role } = tempUser;
 // 🔧 Find role document
 const roleDoc = await Role.findOne({ role_name: role });
 if (!roleDoc) return res.send("Invalid role selected.");

 // 🛠 Save to main User DB with role_id
 await User.create({
     phone,
     email,
     password,
     role_id: roleDoc._id,
 });

 await TempUser.deleteOne({ email });

 const user = await User.findOne({ email }).populate("role_id");

 // 🧠 Use role_name for redirection
 if (user.role_id.role_name === "buyer") {
     res.redirect("/login");
 } else if (user.role_id.role_name === "seller") {
     res.redirect("/login");
 } else {
     res.redirect("/login");
 }
    } catch (error) {
        console.error(error);
        res.status(500).send("OTP verification failed.");
    }
};


const forgotPassword = (req,res) =>{

    res.render("forget-password")
}

const forgetPassword = async (req,res )=>{

    const {email} = req.body;

    const user = await User.findOne({email});
    
    if(!user){
            return res.render("forget-password", {error: "Please enter email Id." });

        // return res.redirect("/forgot-password",{error:"Please enter email Id"})
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
    await user.save();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const resetURL = `${baseUrl}/reset-password/${token}`;
  
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
      },
    });
  
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    });
  
    res.redirect("/forgot-password");
  
}

const getResetPassword = async(req,res) =>{
    const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    // If token valid, render a Reset Password Form page
    res.render('reset-password', { token }); 
    // (You must have an EJS/Pug/HTML file called reset-password.ejs or similar)
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
}


const resetPassword = async(req,res) =>{
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim() === '') {
    // return res.status(400).send('Password is required');
        return res.render("reset-password", { error: "Password is required",token });

  }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // check expiry
    });
  
    if (!user) {
      return res.render("reset-password", { error: "Invalid or expired token",token });
      // return res.status(400).json({ message: 'Invalid or expired token' });
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  
    await user.save();
  
    res.redirect("/login",)
    
  
}


module.exports = {register,postRegister,verifyOtp,forgotPassword,getResetPassword,resetPassword,forgetPassword}