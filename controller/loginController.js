const User = require("../models/User")
const Role = require("../models/Role")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const login = async(req,res) =>{
    res.render("login")
}

const postLogin = async(req,res) =>{
    try{
        const {email,password} = req.body;
        console.log("Request Body:", req.body);

        if(!email || !password){
            return res.render("login", { error: "Email and password are required" });
        }

        let user = await User.findOne({ email }).select("+password").populate("role_id");
        console.log("User found:", user);

        if(!user){
            return res.render("login", { error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render("login", { error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role_id.role_name,phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true });

        if(user.role_id.role_name == "buyer"){
            res.redirect("/");
        } else if(user.role_id.role_name == "seller"){
            res.redirect("/seller/dashboard");
        } else {
            res.redirect("/admin/properties");
        }

    } catch(error){
        console.log("Login error:", error);  // This will help you debug
        res.render("login", { error: "Something went wrong" });
    }
}


const logout = (req, res) => {
    res.clearCookie("token"); // This clears the JWT cookie
    res.redirect("/login");   // Redirect to login page or homepage
};




module.exports = {login,postLogin,logout}