const Landtype = require("../../models/landType");

const landType =async(req,res) =>{

    res.render("admin/landtype/create")
}

const postLandType = async(req, res) => {
  try {
    const { landType } = req.body;
    const imageFile = req.file ? req.file.path : null;

    const Land = new Landtype({
      land_type: landType,
      image: imageFile
    });

    await Land.save();
    req.flash('success_msg', 'Land Type has been added successfully');
    res.redirect("/admin/land-types");
  } catch (error) {
    console.log(error);
  }
};

const ShowlandType = async(req,res) =>{
    try{
        const lands = await  Landtype.find({});
        res.render("admin/landtype/index",{lands})

    }catch(error){

    }
}
const editLandType = async(req,res) =>{
    try{
    const landId = req.params.id;
    const lands = await Landtype.findById(landId)
    
    res.render("admin/landtype/edit",{lands})
    }catch(error){
        console.log(error)
    }
    }

   const updateLandType = async(req, res) => {
  try {
    const { landType } = req.body;
    const imageFile = req.file;

    const data = { land_type: landType };

    if (imageFile) {
      // Usually cloudinary file object has .path or .secure_url for full URL
      data.image = imageFile.path || imageFile.secure_url || imageFile.filename;
    }

    const LandId = req.params.id;

    const land = await Landtype.findByIdAndUpdate(LandId, data, { new: true });

    if (!land) {
      return res.status(404).send("Land not found");
    }

    req.flash('success_msg', 'Land Type has been updated successfully');
    res.redirect(`/admin/land-types`);
  } catch (error) {
    console.log("Error updating land type:", error);
    res.status(500).send("Internal Server Error");
  }
};


const deleteLandType = async(req,res) =>{
try{
const landId = req.params.id;
const lands = await Landtype.findByIdAndDelete(landId)
req.flash('success_msg', 'Land Type has been deleted successfully');
res.redirect("/admin/land-types")
}catch(error){
    console.log(error)
}
}
module.exports = {landType,postLandType,ShowlandType,deleteLandType,editLandType,updateLandType}