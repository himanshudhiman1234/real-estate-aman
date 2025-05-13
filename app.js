const express = require("express")
const app =express();
const path = require("path")
const connectDB = require("./db/db")
const cookieParser = require('cookie-parser')
const  register = require("./routes/register")
const login = require("./routes/login")
const sellerDashboard = require("./routes/seller/dashboard")
const session = require('express-session');


const flash = require('connect-flash');
//admin Routes
const adminProperty = require("./routes/admin/property")
const adminUsers = require("./routes/admin/user")
const landType = require("./routes/admin/landType")
//fronted
const home = require("./routes//index")
//buyer
const buyer = require("./routes/buyer/dashboard")


const {authenticate,authorizeRole} = require("./middleware/authenticate")

require("dotenv").config()

connectDB()

app.use(cookieParser())
app.use(authenticate);
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null; 
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.use(express.static("public"))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",register)
app.use("/",login)

app.use("/seller",authenticate,authorizeRole('seller'),sellerDashboard)
app.use("/admin",authenticate,authorizeRole('admin'),adminProperty)
app.use("/admin",authenticate,authorizeRole('admin'),adminUsers)
app.use("/admin",authenticate,authorizeRole('admin'),landType)



//frontend
app.use("/",home)

////////buyer
app.use("/",authenticate,authorizeRole('admin','buyer'),buyer)




app.get('logout',  (req, res) => {
    res.clearCookie("token");
    res.redirect("/login"); // ya jahan bhi logout ke baad bhejna hai
})

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log(`server is running ${process.env.PORT}`)
})