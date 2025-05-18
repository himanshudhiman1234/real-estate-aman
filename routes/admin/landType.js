const express = require("express")
const router = express()
const {landType,postLandType,ShowlandType,deleteLandType,editLandType,updateLandType} = require("../../controller/admin/LandType")
// const upload = require("../../middleware/multer")
const upload = require('../../middleware/upload'); // using multer-storage-cloudinary

router.get("/add-landtype",landType)
router.post("/add-landtype",upload.single('image'),postLandType)

router.get("/land-types",ShowlandType)
router.post("/landtype-delete/:id",deleteLandType)

router.get("/edit-land-type/:id",editLandType)

router.post("/landtype-update/:id",upload.single('image'),updateLandType)


module.exports = router