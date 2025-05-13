const express = require("express")
const router = express.Router();
const {register,postRegister,verifyOtp,forgotPassword,forgetPassword,resetPassword,getResetPassword} = require("../controller/registerController")

router.get("/register",register)
router.post("/register",postRegister)
router.post("/verify-otp",verifyOtp);
router.get("/forgot-password",forgotPassword)
router.post("/forget-password",forgetPassword)
router.get("/reset-password/:token",getResetPassword)
router.post("/reset-password/:token",resetPassword)




module.exports = router