const mongoose = require("mongoose")
const User = require("../models/User")
const Role= require("../models/Role")
const bcrypt = require("bcrypt")

require('dotenv').config();


mongoose.connect('mongodb+srv://humanshud950:himanshud950@cluster0.hsjzd.mongodb.net/realestate_aman', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connected");

    
    await User.deleteOne({ email: "admin@admin.com" });


    const role = await Role.findOne({ role_name: "admin" });

    const hashPassword = await bcrypt.hash("aman@9869", 10);

    const user = { email: "admin@admin.com", phone : "1234567890",password:hashPassword,role_id:role.id};
      


    await User.create(user);

    console.log("Admin seeded successfully!");

    mongoose.disconnect();
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
