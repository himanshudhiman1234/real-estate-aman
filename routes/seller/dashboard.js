const express = require("express")
const router = express.Router();
const {sellerDashboard,property,editProperty,submitProperty,deleteProperty,updateProperty} = require("../../controller/seller/property")
const upload = require("../../middleware/multer")

router.get("/dashboard",sellerDashboard)
router.get("/post-property",property)
// router.post("/submit-property",upload.array('images', 10),submitProperty)
router.post("/submit-property", upload.array('images', 10), submitProperty);
router.get("/edit-property/:id",editProperty)
router.post("/property-delete/:id", deleteProperty);
router.post("/update-property/:id", upload.array('images', 10), updateProperty);



module.exports = router