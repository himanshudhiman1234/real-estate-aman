const Property = require("../models/property")
const LandType = require("../models/landType")

const index = async(req,res) =>{
    const properties = await Property.find({status:1}).limit(3)
    const property = await Property.find({status:1});


    const Land = await LandType.find({})


    res.render("frontend/index",{properties,Land,property})
}


const property = async(req,res)=>{
    const search = req.query.search || "";
    const sort = req.query.sort || ""; // ✅ fix: define sort
    const city = req.query.city || "";
    console.log("city",city)
    const state = req.query.state || "";
    console.log("state",state)

    const page = parseInt(req.query.page || 1);

    const limit = 6;
    const skip = (page - 1) * limit;

    const query = {
        address : {
            $regex: search,
            $options:"i"
        }
    };

    if (state) {
        query.state = state;
    }

    if (city) {
        query.city = city;
    }

    let sortOption = {};
    if (sort === "asc") {
        sortOption.price = 1;
    } else if (sort === "desc") {
        sortOption.price = -1;
    }

    const properties = await Property.find(query).sort(sortOption).limit(limit);
    const totalCount = await Property.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);

    res.render("frontend/property", { properties,
        search,
        sort,
        state,
        city,
        totalCount,
        totalPages,
        currentPage: page});
};

const propertyDetails = async(req,res) =>{
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId)
    console.log(property)
    res.render("frontend/property-details",{property})
}


const propertyByCollection  = async(req,res)=>{
    const propertyname = req.params.land_type;
    console.log(propertyname)
    try {
        const properties = await Property.find({ LandType: propertyname });
        console.log(properties)
        if (!properties) {
            return res.status(404).send("properties type not found");
        }

       
    res.render("frontend/collection-properties",{properties})
    }catch(error){

    }
}

const about = (req,res) =>{
    res.render("frontend/about")
}


const contact = (req,res) =>{
    res.render("frontend/contact")
}
const privacyPolicy = (req,res) =>{
    res.render("frontend/privacy-policy")
}
const termsCondition = (req,res) =>{
    res.render("frontend/terms-condition")
}

module.exports = {index,property,propertyDetails,propertyByCollection,about,contact,privacyPolicy,termsCondition}