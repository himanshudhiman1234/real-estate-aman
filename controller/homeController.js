const Property = require("../models/property")
const LandType = require("../models/landType")
const nodemailer = require('nodemailer');

const index = async(req,res) =>{
    const properties = await Property.find({status:1}).limit(3)
    const property = await Property.find({status:1});


    const Land = await LandType.find({})


    res.render("frontend/index",{properties,Land,property})
}


const property = async(req,res)=>{
    const search = req.query.search || "";
    const sort = req.query.sort || ""; // ✅ fix: define sort
    const city = req.query.city || "";
    console.log("city",city)
    const state = req.query.state || "";
    console.log("state",state)

    const page = parseInt(req.query.page || 1);

    const limit = 6;
    const skip = (page - 1) * limit;

    const query = {
        address : {
            $regex: search,
            $options:"i"
        }
    };

    if (state) {
        query.state = state;
    }

    if (city) {
        query.city = city;
    }

    let sortOption = {};
    if (sort === "asc") {
        sortOption.price = 1;
    } else if (sort === "desc") {
        sortOption.price = -1;
    }

    const properties = await Property.find(query).sort(sortOption).limit(limit);
    const totalCount = await Property.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);

    res.render("frontend/property", { properties,
        search,
        sort,
        state,
        city,
        totalCount,
        totalPages,
        currentPage: page});
};

const propertyDetails = async(req,res) =>{
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId)
    console.log(property)
    res.render("frontend/property-details",{property})
}


const propertyByCollection  = async(req,res)=>{
    const propertyname = req.params.land_type;
    console.log(propertyname)
    try {
        const properties = await Property.find({ LandType: propertyname });
        console.log(properties)
        if (!properties) {
            return res.status(404).send("properties type not found");
        }

       
    res.render("frontend/collection-properties",{properties})
    }catch(error){

    }
}

const about = (req,res) =>{
    res.render("frontend/about")
}

const submitContact = async(req,res) => {
    const {name,email,phone,message} = req.body;
        if (!name || !email || !phone || !message) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
             user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
            }
        });

        // Email content
        const mailOptions = {
            from: email, // user's email
            to: 'contact.zameensale@gmail.com', // where you want to receive the message
            subject: 'New Contact Form Submission',
            html: `
                <h3>New Contact Request</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.redirect("/contact")
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Something went wrong.");
    }

    
}

const contact = (req,res) =>{
    res.render("frontend/contact")
}
const privacyPolicy = (req,res) =>{
    res.render("frontend/privacy-policy")
}
const termsCondition = (req,res) =>{
    res.render("frontend/terms-condition")
}


module.exports = {index,property,propertyDetails,propertyByCollection,about,contact,privacyPolicy,submitContact,termsCondition}