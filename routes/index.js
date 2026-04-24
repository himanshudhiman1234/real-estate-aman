const express = require("express")
const router = express.Router();
const {index,property,propertyDetails,propertyByCollection,submitContact,
    about,contact,privacyPolicy,termsCondition,accessdenied,requestCallback,propertylist} = require("../controller/homeController")
const {authenticate,authorizeRole} = require("../middleware/authenticate")
const {postRequirement,submitRequirement} = require("../controller/postrequirement")



router.get("/",index)
router.get("/about",about)
router.get("/contact",contact)
router.get("/privacy-policy",privacyPolicy)
router.get("/terms-condition",termsCondition)
router.post("/submit-contact",submitContact)
router.get("/post-requirement",postRequirement)
router.post("/post-requirement",submitRequirement)
router.get("/properties-category", propertylist);



router.get("/access-denied",accessdenied)


router.get("/properties",property)
router.get("/property-details/:id",authenticate,authorizeRole('buyer','admin','seller'),propertyDetails)

router.get("/landtype/:land_type",propertyByCollection)
router.post('/property/:id/request-callback', authenticate, requestCallback);
module.exports = router