const User = require("../../models/User")
const Property = require("../../models/property")

const showUsers = async(req,res) =>{

    const users = await User.aggregate([
        {
          $lookup: {
            from: "roles",               // <- Correct collection name
            localField: "role_id",
            foreignField: "_id",
            as: "role"
          }
        },
        { $unwind: "$role" },
        { $match: { "role.role_name": { $ne: "admin" } } }
      ]);


    res.render("admin/user/index",{users})
}

const editUser = async(req,res)=>{

    try{
        const userId = req.params.id;

        const users = await User.findById(userId)
        
        res.render("admin/user/editUser",{users})

    }catch(error){
        console.log(error)
    }
}

const showUserProperties = async(req,res) =>{
  const UserId = req.params.id;
  // console.log(UserIcd)
  const UserProperties = await Property.find({user_id:UserId});
  res.render("admin/user/showProperty",{UserProperties})
  
}
const deleteProperty = async (req, res) => {
  try {
      const PropertyId = req.params.id;
      const deleted = await Property.findByIdAndDelete(PropertyId);

      if (!deleted) {
          return res.status(404).json({ success: false, message: "Property not found" });
      }

      return res.json({ success: true, message: "Property deleted successfully" });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUserByAdmin = async (req, res) => {
    try {
        console.log("Request Body",req.body)
      const { email, phone } = req.body;
      const userId = req.params.id;
  
      await User.findByIdAndUpdate(userId, { email, phone });
         req.flash('success_msg', 'User has been updated successfully');

      res.redirect("/admin/users"); // Redirect to products page

        } catch (error) {
      console.log(error);
      res.status(500).send("Failed to update user");
    }
  };
  
const deleteUser = async(req,res) =>{
    try{
        const UserId = req.params.id;
        const deleteUser = await User.findByIdAndDelete(UserId)
    
        if(!deleteUser){
            return res.status(404).json({ message: "User not found" });
        }
         req.flash('success_msg', 'User has been deleted successfully');
        res.redirect("/admin/users")

    }catch(error){
        console.log(error)
    }
}
module.exports  = {showUsers,editUser,updateUserByAdmin,deleteUser,showUserProperties,deleteProperty}