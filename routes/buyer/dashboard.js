const express = require("express");

const router = express.Router()
const buyerProfile = require("../../controller/buyer/dashboard")

router.get("/buyer",buyerProfile)


module.exports = router