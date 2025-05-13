const express = require("express")
const router = express.Router();
const {index,property,propertyDetails,propertyByCollection,about,contact,privacyPolicy,termsCondition} = require("../controller/homeController")
const {authenticate,authorizeRole} = require("../middleware/authenticate")
 
router.get("/",index)
router.get("/about",about)
router.get("/contact",contact)
router.get("/privacy-policy",privacyPolicy)
router.get("/terms-condition",termsCondition)




router.get("/properties",property)
router.get("/property-details/:id",authenticate,authorizeRole('buyer','admin','seller'),propertyDetails)

router.get("/landtype/:land_type",propertyByCollection)

module.exports = router