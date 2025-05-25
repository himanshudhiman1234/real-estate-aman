const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      // LandType: {
      //   type: String,
      //   enum: ['Agricultural', 'Residential', 'CommercialLand' ,"EstateLand","AuctionLand"],
      //   required: true
      // },
      LandType: {
        type: String,
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      areameasure:{
        type:String,
        required:true
      },
      area:{
        type:String,
        required:true
      },
      // Location Info
      country: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
       listed_by: {
        type: String,
        required: true,
        default:"Owner"
      },
      city: {
        type: String,
        required: true
      },
      address: String,
      pincode: {
        type: String,
        required: true
      },
    
      price: {
        type: Number,
        required: true
      },
      // Images
      images: [String], // array of image URLs or filenames
    
      // Seller Info
      sellerName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },status:{
        type: Number,
        enum:[0,1],
        default:0
      },
      user_id:{
        type:mongoose.Schema.ObjectId,ref:"User"
      },
    
}, { timestamps: true });

const Property = mongoose.model("Property", propertySchema);

module.exports =Property