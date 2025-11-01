const Property = require("../models/property");
const Requirement = require("../models/requirement");
const nodemailer  = require("nodemailer")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });
const postRequirement = async (req, res) => {
    const message = req.query.success ? "Requirement submitted successfully" : null;
    res.render("frontend/post-requirement", { message, error: null ,showRequirement: [] });
  };
  

const submitRequirement = async (req, res) => {
  try {
    const { state, city, email, phone, name, message, price } = req.body;

  
    if (!state || !city || !email || !phone || !name || !price || !message) {
      return res.render("frontend/post-requirement", {
        error: "All fields are required",
        message: null,
      });
    }


    const newRequirement = new Requirement({
      state,
      city,
      email,
      phone,
      name,
      message,
      price,
    });

    await newRequirement.save();
  
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "New Requirement Submitted",
        html: `
          <h3>New Requirement Posted</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      const showRequirement = await Property.find({city:city,state:state}).sort({createdAt : -1})

      return res.render("frontend/post-requirement", {
        message: "Requirement submitted successfully.you will received match property soon.",
        error: null,
        showRequirement : showRequirement||  [],
      });
      
      
    
  } catch (error) {
    console.error(error);
    return res.render("frontend/post-requirement", {
      error: "Internal server error",
      message: null,
    });
  }
};

module.exports = { postRequirement, submitRequirement };
