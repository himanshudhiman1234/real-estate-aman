const Property = require("../../models/property")
const LandType = require("../../models/landType")

const path = require("path")



const property = async (req,res) =>{

    const Lands = await LandType.find({}) 
    res.render("admin/property/create",{Lands})
}





const properties = async(req,res) =>{
    const property = await Property.find();
   
    res.render("admin/property/index",{property})
}


const editProperty = async (req,res) =>{
    
    const propertyId = req.params.id;

    const property = await  Property.findById(propertyId)
    // console.log(property)
    const Lands = await LandType.find({});
    res.render("admin/property/editProperty",{property,Lands})
}

const updateProperty = async(req,res) =>{

    try{
        console.log(req.body)
        if (req.body.negotiable === "on") {
            req.body.negotiable = true;
          } else {
            req.body.negotiable = false;
          }
          
        const {
            title, description, state,country, city, price, area,propertytype,areameasure,
            locality,address,pincode,sellerName,phone,email
        } = req.body;
        
        const images = req.files?.map(file => file.path) || [];

    
        const data = { title, description, state,country, city, price,area,LandType:propertytype,
            locality,address,pincode,sellerName,phone,email,areameasure,
            images
    }
        const PropertyId = req.params.id;
    
        const property = await Property.findByIdAndUpdate(PropertyId, data, { new: true });

        if (!property) {
            return res.status(404).send("Property not found");
        }
        req.flash('success_msg', 'Property has been updated successfully');
        res.redirect(`/admin/edit-property/${PropertyId}`)

        
    }catch(error){
     console.log("Error updating product:", error);
        res.status(500).send("Internal Server Error",error);
    }
   
}
const updateStatus = async(req,res) =>{
    try{
        console.log(req.body)
        const {status} = req.body;
        console.log("hellooo")
        const PropertryId = req.params.id;
      const property =  await Property.findByIdAndUpdate(PropertryId,{status})
      
        res.json({ success: true, message: "Status updated" });

    }catch(error){
        console.log(error)
    }
}
const deleteProperty = async(req,res) =>{
    try{

        const PropertyId = req.params.id;
        const deleteProperty = await Property.findByIdAndDelete(PropertyId)
    
        if(!deleteProperty){
            return res.status(404).json({ message: "Propery not found" });
        }
              req.flash('success_msg', 'Property has been deleted successfully');
        res.redirect("/admin/properties")

    }catch(error){
        console.log(error)
    }
}
const submitProperty = async (req, res) => {
    try {
        console.log("Reqqq",req.body)
        const {
            title, description, state,country, city, price, area,propertytype,areameasure,
            locality,address,pincode,sellerName,phone,email
        } = req.body;
        if( !title ||  !description ||  !state || !country || !city || !price || !area || !propertytype || !areameasure ||
            locality || !address ||!pincode ||!sellerName || !phone||!email){
                 const Lands = await LandType.find({});
      return res.render("admin/property/create", { error: "All fields are required",Lands });

            }
        const userId = req.user.id;
       console.log("userIDDD",userId)
        const images = req.files;

        // const imageFile = images.map((image) => image.filename);


       const imageFile = images.map((image) => image.path); // <-- path has the secure_url



       
        const property = new Property({
            title, description, state,country, city, price,area,LandType:propertytype,
            locality,address,pincode,sellerName,phone,email,areameasure,
            images: imageFile,user_id: userId  
        });

        console.log("Property to save:", property);
        const savedProperty = await property.save();
          req.flash('success_msg', 'Property has been added successfully');
        res.redirect("/admin/properties")
    } catch (error) {
        console.error("Error while saving property:", error);
        return res.status(500).json({ message: "Error while saving property", error });
    }
};
module.exports = {properties,deleteProperty,updateProperty,editProperty,updateStatus,property,submitProperty}