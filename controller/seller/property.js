const Property = require("../../models/property")
const User = require("../../models/User")
const LandType = require("../../models/landType")

const path = require("path")
const sellerDashboard = async (req,res) =>{

    if(req.user.role == "seller"){

        const UserId = req.user.id;
    
        const properties = await Property.find({user_id: UserId})
        res.render("seller/index",{properties})
    }else{
        return res.redirect("/access-denied")

    }
    // console.log(properties)
}

const property = async (req,res) =>{

    const Lands = await LandType.find({}) 
    res.render("seller/postProperty",{Lands})
}

const submitProperty = async (req, res) => {
  try {
    const {
      title, description, state, country, city, price,
      area, propertytype, areameasure, locality,
      address, pincode, sellerName, phone, email,
      listed_by, category, projectname, plotarea,
      areaunit, facing, roadwidth, possession,
      totalfloor, bhk, superarea, carpetarea,areaunits
    } = req.body;

    // Common validation
    if (
      !title || !description || !state || !country || !city ||
      !price || !address || !pincode ||
      !sellerName || !phone || !email || !listed_by || !category
    ) {
      const Lands = await LandType.find({});
      return res.render("seller/postProperty", {
        error: "All common fields are required",
        Lands
      });
    }

    // Category validation
    if (category === "land" && (!propertytype || !areameasure || !area)) {
      const Lands = await LandType.find({});
      return res.render("seller/postProperty", {
        error: "Land fields are required",
        Lands
      });
    }

    if (category === "plots" && (!plotarea || !facing || !roadwidth || !areaunits)) {
      const Lands = await LandType.find({});
      return res.render("seller/postProperty", {
        error: "Plot fields are required",
        Lands
      });
    }

    if (category === "house" && (!plotarea || !bhk || !totalfloor || !areaunits)) {
      const Lands = await LandType.find({});
      return res.render("seller/postProperty", {
        error: "House fields are required",
        Lands
      });
    }

    if (category === "flats" && (!projectname || !superarea || !carpetarea || !bhk)) {
      const Lands = await LandType.find({});
      return res.render("seller/postProperty", {
        error: "Flat fields are required",
        Lands
      });
    }

    // Image handling
    const images = req.files || [];
    const imageFile = images.map(img => img.path);

    // User id
    const userId = req.user.id;

    // Save data
    const property = new Property({
      title,
      description,
      state,
      country,
      city,
      price,
      area,
      LandType: propertytype,
      areameasure,
      locality,
      address,
      pincode,
      sellerName,
      phone,
      email,
      listed_by,
      category,
      projectname,
      plotarea,
      areaunit,
      facing,
      roadwidth,
      possession,
      totalfloor,
      bhk,
      areaunits,
      superarea,
      carpetarea,
      images: imageFile,
      user_id: userId
    });

    await property.save();

    req.flash("success_msg", "Property Added Successfully");
    res.redirect("/seller/dashboard");

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};


const editProperty = async (req,res) =>{
    
    const propertyId = req.params.id;
    const property = await  Property.findById(propertyId)
    const Lands = await LandType.find({});
    console.log("property",property)

    res.render("seller/editProperty",{property,Lands})
}

const updateProperty = async (req, res) => {
  try {
    const PropertyId = req.params.id;

    const {
      title, description, state, country, city, price,
      area, propertytype, areameasure, locality,
      address, pincode, sellerName, phone, email,
      listed_by, category, projectname, plotarea,
      areaunit, facing, roadwidth, possession,
      totalfloor, bhk, superarea, carpetarea, areaunits
    } = req.body;

    const data = {
      title,
      description,
      state,
      country,
      city,
      price,
      area,
      LandType: propertytype,
      areameasure,
      locality,
      address,
      pincode,
      sellerName,
      phone,
      email,
      listed_by,
      category,
      projectname,
      plotarea,
      areaunit,
      facing,
      roadwidth,
      possession,
      totalfloor,
      bhk,
      areaunits,
      superarea,
      carpetarea,
    };

    // images update (replace old ones if new uploaded)
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => file.path);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      PropertyId,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).send("Property not found");
    }

    req.flash("success_msg", "Property updated successfully");
    res.redirect("/seller/dashboard");

  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).send("Internal Server Error");
  }
};



const deleteProperty = async(req,res) =>{
    try{

        const PropertyId = req.params.id;
        const deleteProperty = await Property.findByIdAndDelete(PropertyId)
    
        if(!deleteProperty){
                  req.flash('error_msg', 'Property not found');
            // return res.status(404).json({ message: "Propery not found" });
        }
            req.flash('success_msg', 'Property has been deleted successfully');

        res.redirect("/seller/dashboard")

    }catch(error){
        console.log(error)
    }
}

module.exports = {sellerDashboard,property,submitProperty,editProperty,updateProperty,deleteProperty}