
const mongoose = require("mongoose");
const Role = require("../models/Role");

require('dotenv').config();
console.log("MONGO_URI:", 'mongodb+srv://humanshud950:himanshud950@cluster0.hsjzd.mongodb.net/realestate_aman');


mongoose.connect('mongodb+srv://humanshud950:himanshud950@cluster0.hsjzd.mongodb.net/realestate_aman', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connected");

    await Role.deleteMany({}); // Clear old roles

    const roles = [
        { role_name: "buyer" },
        { role_name: "seller" },
        {role_name:"admin"}
    ];

    await Role.insertMany(roles);
    console.log("Roles seeded successfully!");

    mongoose.disconnect();
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
