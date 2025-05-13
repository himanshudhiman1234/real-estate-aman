const mongoose = require("mongoose");

const LandSchema = new mongoose.Schema({
    land_type: {
        type: String,
    },
    image: {type:String}, // array of image URLs or filenames

}, { timestamps: true });

const Landtype = mongoose.model("Landtype", LandSchema);

module.exports = Landtype