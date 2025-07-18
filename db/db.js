const mongoose = require("mongoose")

const connectDB = async(req,res)=>{
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("mongo Connected successfully")
    }catch(error){
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit with failure
    }
    }
    
    
module.exports = connectDB;