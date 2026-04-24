const Property = require("../models/property")
const LandType = require("../models/landType")
const nodemailer = require('nodemailer');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const properties = await Property.find({ status: 1,category: "land"}).limit(3);

        const latestProperties = await Property.find({ status: 1,category:"land" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            console.log("land",latestProperties)


        const totalProperties = await Property.countDocuments({ status: 1 ,category: "land"});
        const totalPages = Math.ceil(totalProperties / limit);

        const Land = await LandType.find({});

        res.render("frontend/index", {
            title: "Land for Sale in India – Buy Agriculture, Farm & Residential Plots | ZameenSale",
            description: "Find verified agriculture, farm, and residential land for sale in India. Explore Haryana, Punjab, and NCR plots. Best land deals 2025.",
            keywords: "Land for Sale, Agriculture Land, Farm Land, Residential Plots",

            properties,
            Land,
            property: latestProperties,

            currentPage: page,
            totalPages
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const propertylist = async (req, res) => {
  try {
    const category = req.query.category || "";
    const search = req.query.search || "";
    const sort = req.query.sort || "";

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "asc") {
      sortOption = { price: 1 };
    }

    if (sort === "desc") {
      sortOption = { price: -1 };
    }

    const properties = await Property.find(filter).sort(sortOption);

    res.render("frontend/property-categories", {
      properties,
      category,
      search,
      sort
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

const property = async(req,res)=>{
    const search = req.query.search || "";
    const sort = req.query.sort || ""; 
    const city = req.query.city || "";
    // console.log("city",city)
    const state = req.query.state || "";
    // console.log("state",state)

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

    const properties = await Property.find(query).sort(sortOption).skip(skip).limit(limit);
    
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
    console.log("properyies",property)
    res.render("frontend/property-details",{property})
}


const propertyByCollection  = async(req,res)=>{
    const propertyname = req.params.land_type;
    // console.log(propertyname)
    try {
        const properties = await Property.find({ LandType: propertyname });
        // console.log(properties)
        if (!properties) {
            return res.status(404).send("properties type not found");
        }

       
    res.render("frontend/collection-properties",{
        
        properties})
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

const accessdenied = (req,res) =>{
    res.render("access-denied")
}

const requestCallback = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    const user = req.user; // must contain logged-in user details

    // ✅ Send instant response so UI doesn't wait
    res.json({ success: true, message: "Your request has been sent to the seller!" });

    // Now, send emails asynchronously (non-blocking)
    const adminEmail = "admin@example.com";

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const sellerMail = {
      from: process.env.EMAIL_USER,
      to: property.email,
      subject: `Someone is interested in your property: ${property.title}`,
      html: `
        <h3>Hello ${property.sellerName},</h3>
        <p>Someone is interested in your property <b>${property.title}</b>.</p>
        <p>Please reach out to them:</p>
        <ul>
          <li><b>Email:</b> ${user.email}</li>
          <li><b>Phone:</b> ${user.phone}</li>
        </ul>
        <br><p>Thank you,<br>Property Portal Team</p>
      `
    };

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Callback Request for ${property.title}`,
      html: `
        <h3>New Callback Request</h3>
        <p><b>Property:</b> ${property.title}</p>
        <p><b>Seller:</b> ${property.sellerName} (${property.email})</p>
        <hr>
        <p><b>Interested Buyer Details:</b></p>
        <ul>
          <li><b>Email:</b> ${user.email}</li>
          <li><b>Phone:</b> ${user.phone}</li>
        </ul>
      `
    };

    // 💨 Send both emails asynchronously
    transporter.sendMail(sellerMail).catch(console.error);
    transporter.sendMail(adminMail).catch(console.error);

  } catch (err) {
    console.error("Error sending callback request:", err);
  }
};



module.exports = {index,property,propertyDetails,propertyByCollection,about,
    contact,privacyPolicy,submitContact,termsCondition,accessdenied,requestCallback,propertylist}