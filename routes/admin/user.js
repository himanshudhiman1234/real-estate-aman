const express = require("express")
const router = express.Router();
const {showUsers,deleteUser,editUser,updateUserByAdmin,showUserProperties,deleteProperty} = require("../../controller/admin/user")

router.get("/users",showUsers)
router.get("/edit-user/:id",editUser)
router.post("/update-user/:id",updateUserByAdmin)
router.post("/delete-user/:id",deleteUser)
router.get("/user-properties/:id",showUserProperties)
router.delete("/delete-property-status/:id", deleteProperty);

module.exports = router