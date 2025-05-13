const express = require("express")
const router = express.Router();
const {properties,deleteProperty,editProperty,updateProperty,updateStatus,property,submitProperty} = require("../../controller/admin/property")
const upload = require("../../middleware/multer")

router.get("/properties",properties)
router.get("/edit-property/:id",editProperty)
router.post("/update-property/:id", upload.array('images', 10), updateProperty);
router.put("/update-property-status/:id",updateStatus)
router.post("/property-delete/:id",deleteProperty)

router.get("/create-properties",property)
router.post("/submit-property", upload.array('images', 10),submitProperty)


module.exports = router