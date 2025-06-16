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
            title, description, state,country, city, price, area,propertytype,areameasure,
            locality,address,pincode,sellerName,phone,email,listed_by
        } = req.body;   
          if( !title ||  !description ||  !state || !country || !city || !price || !area || !propertytype || !areameasure ||
            locality || !address ||!pincode ||!sellerName || !phone||!email ||!listed_by){
                 const Lands = await LandType.find({});
      return res.render("seller/postProperty", { error: "All fields are required",Lands });

            }
        const userId = req.user.id;
       console.log("userIDDD",userId)
        const images = req.files;

       const imageFile = images.map((image) => image.path); // <-- path has the secure_url

       
        const property = new Property({
            title, description, state,country, city, price,area,LandType:propertytype,
            locality,address,pincode,sellerName,phone,email,areameasure,
            images: imageFile,user_id: userId,listed_by
        });

        console.log("Property to save:", property);
        const savedProperty = await property.save();
    req.flash('success_msg', 'Property has been Added successfully');

        res.redirect("/seller/dashboard")
    } catch (error) {
        console.error("Error while saving property:", error);
        return res.status(500).json({ message: "Error while saving property", error });
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
    req.body.negotiable = req.body.negotiable === "on";

    const {
      title, description, state, country, city, price, area, propertytype, areameasure,
      locality, address, pincode, sellerName, phone, email, listed_by
    } = req.body;

    const PropertyId = req.params.id;

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
      negotiable: req.body.negotiable,
    };

    // 🟡 If files exist, then add images to the update
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => file.path);
    }

    const updatedProperty = await Property.findByIdAndUpdate(PropertyId, data, { new: true });

    if (!updatedProperty) {
      return res.status(404).send("Property not found");
    }

    req.flash('success_msg', 'Property has been updated successfully');
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