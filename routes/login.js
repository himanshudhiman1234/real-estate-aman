const express = require("express")
const router = express.Router();
const {login,postLogin,logout} = require("../controller/loginController")

router.get("/login",login)
router.post("/login",postLogin)
router.get("/logout",logout)


module.exports = router