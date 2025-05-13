const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        enum: ["buyer", "seller","admin"],
        default: "seller"
    }
}, { timestamps: true });

const Role = mongoose.model("Role", RoleSchema);

module.exports =Role