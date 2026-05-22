const Property = require("../../models/property")
const LandType = require("../../models/landType")

const path = require("path")

const ExcelJS = require("exceljs");
const fs = require("fs");


const stateCityMap = require("../../utils/stateCityMap");



const property = async (req,res) =>{

    const Lands = await LandType.find({}) 
    res.render("admin/property/create",{Lands})
}





const properties = async(req,res) =>{
    const property = await Property.find().sort({ _id: -1 });
    
    console.log("property",property)

    res.render("admin/property/index",{property})
}


const editProperty = async (req,res) =>{
    
    const propertyId = req.params.id;

    const property = await  Property.findById(propertyId)
    // console.log(property)
    const Lands = await LandType.find({});
    res.render("admin/property/editProperty",{property,Lands})
}

const updateProperty = async (req, res) => {
  try {
    console.log(req.body);

    // Convert negotiable string to boolean
    req.body.negotiable = req.body.negotiable === "on";

    const {
      title, description, state, country, city, price, area, propertytype, areameasure,
      locality, address, pincode, sellerName, phone, email, listed_by
    } = req.body;

    const PropertyId = req.params.id;

    // 🟢 Fetch existing property first
    const property = await Property.findById(PropertyId);
    if (!property) {
      return res.status(404).send("Property not found");
    }

    // 🔁 Retain old images if no new ones uploaded
    let images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else {
      images = property.images;
    }

    // Prepare updated data
    const data = {
      title,
      description,
      state,
      country,
      city,
      price,
      area,
      LandType: propertytype,
      locality,
      address,
      pincode,
      sellerName,
      phone,
      email,
      areameasure,
      images,
      listed_by,
      negotiable: req.body.negotiable,
    };

    const updatedProperty = await Property.findByIdAndUpdate(PropertyId, data, { new: true });

    req.flash('success_msg', 'Property has been updated successfully');
    res.redirect(`/admin/edit-property/${PropertyId}`);
    
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateStatus = async(req,res) =>{
    try{
        console.log(req.body)
        const {status} = req.body;
        console.log("hellooo")
        const PropertryId = req.params.id;
      const property =  await Property.findByIdAndUpdate(PropertryId,{status})
      
        res.json({ success: true, message: "Status updated" });

    }catch(error){
        console.log(error)
    }
}
const deleteProperty = async(req,res) =>{
    try{

        const PropertyId = req.params.id;
        const deleteProperty = await Property.findByIdAndDelete(PropertyId)
    
        if(!deleteProperty){
            return res.status(404).json({ message: "Propery not found" });
        }
              req.flash('success_msg', 'Property has been deleted successfully');
        res.redirect("/admin/properties")

    }catch(error){
        console.log(error)
    }
}
const submitProperty = async (req, res) => {
    try {
        console.log("Reqqq",req.body)
        const {
            title, description, state,country, city, price, area,propertytype,areameasure,
            locality,address,pincode,sellerName,phone,email,listed_by
        } = req.body;
        if( !title ||  !description ||  !state || !country || !city || !price || !area || !propertytype || !areameasure ||
            locality || !address ||!pincode ||!sellerName || !phone||!email){
                 const Lands = await LandType.find({});
      return res.render("admin/property/create", { error: "All fields are required",Lands });

            }
        const userId = req.user.id;
       console.log("userIDDD",userId)
        const images = req.files;

        // const imageFile = images.map((image) => image.filename);


       const imageFile = images.map((image) => image.path); // <-- path has the secure_url



       
        const property = new Property({
            title, description, state,country, city, price,area,LandType:propertytype,
            locality,address,pincode,sellerName,phone,email,areameasure,
            images: imageFile,user_id: userId ,listed_by
        });

        console.log("Property to save:", property);
        const savedProperty = await property.save();
          req.flash('success_msg', 'Property has been added successfully');
        res.redirect("/admin/properties")
    } catch (error) {
        console.error("Error while saving property:", error);
        return res.status(500).json({ message: "Error while saving property", error });
    }
};

const propertyUploadFile = async (req,res) =>{

    res.render("admin/property/uploadFile" ,{
    failedRows: [],
    success: null,
    totalRows: 0,
    inserted: 0,
    failed: 0
  });

}




const clean = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const getValue = (row, key) => {
  const realKey = Object.keys(row).find(
    (k) => k.trim().toLowerCase() === key.trim().toLowerCase()
  );

  return realKey ? clean(row[realKey]) : "";
};

const postPropertyUploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Excel file is required");
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];

    const rows = [];
    const headers = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = clean(cell.value);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData = {};

      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber]] = cell.value;
      });

      rows.push({
        rowNumber,
        data: rowData,
        images: []
      });
    });

    const uploadDir = path.join(
      __dirname,
      "../../public/uploads/excel-images"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    worksheet.getImages().forEach((image) => {
      const imageId = image.imageId;

      const media = workbook.model.media.find(
        (m) => m.index === imageId
      );

      if (!media) return;

      const rowNumber = image.range.tl.nativeRow + 1;

      const ext = media.extension || "png";
      const filename = `excel-img-${Date.now()}-${rowNumber}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, media.buffer);

      const imagePathForDb = `/uploads/excel-images/${filename}`;

      const matchedRow = rows.find((r) => r.rowNumber === rowNumber);

      if (matchedRow) {
        matchedRow.images.push(imagePathForDb);
      }
    });

    const insertData = [];
    const failedRows = [];

    for (const item of rows) {
      const row = item.data;

      const category = getValue(row, "ProprtyType").toLowerCase();

      const title = getValue(row, "PropertyTitle");
      const description = getValue(row, "Description");
      const state = getValue(row, "State");
      const city = getValue(row, "City");

      const country = getValue(row, "Country");
      const price = getValue(row, "Price");
      const address = getValue(row, "Adress");
      const pincode = getValue(row, "Pincode");
      const sellerName = getValue(row, "Seller Name");
      const phone = getValue(row, "Phone Number");
      const email = getValue(row, "Email");

      const listed_by = getValue(row, "LandListedBy");
      const propertytype = getValue(row, "LandType");
      const areameasure = getValue(row, "LandAreaMeasurement");
      const area = getValue(row, "Area");

      if (
        !title ||
        !description ||
        !state ||
        !country ||
        !city ||
        !price ||
        !address ||
        !pincode ||
        !sellerName ||
        !phone ||
        !email ||
        !listed_by ||
        !category
      ) {
        failedRows.push({
          rowNumber: item.rowNumber,
          reason: "Common required fields missing",
          row
        });
        continue;
      }

      if (!stateCityMap[state]) {
        failedRows.push({
          rowNumber: item.rowNumber,
          reason: "Invalid state",
          state,
          row
        });
        continue;
      }

      if (!stateCityMap[state].includes(city)) {
        failedRows.push({
          rowNumber: item.rowNumber,
          reason: "Invalid city for selected state",
          state,
          city,
          row
        });
        continue;
      }

      if (category === "land" && (!propertytype || !areameasure || !area)) {
        failedRows.push({
          rowNumber: item.rowNumber,
          reason: "Land fields are required",
          row
        });
        continue;
      }

      insertData.push({
        title,
        description,
        state,
        country,
        city,
        price,
        area,

        LandType: propertytype,
        areameasure,

        locality: getValue(row, "Locality"),
        address,
        pincode,
        sellerName,
        phone,
        email,

        listed_by,
        category,

        projectname: getValue(row, "ProjectName"),
        plotarea: getValue(row, "PlotArea"),
        areaunit: getValue(row, "AreaUnit"),
        facing: getValue(row, "Facing"),
        roadwidth: getValue(row, "RoadWidth"),
        possession: getValue(row, "Possession"),
        totalfloor: getValue(row, "TotalFloor"),
        bhk: getValue(row, "BHK"),
        superarea: getValue(row, "SuperArea"),
        carpetarea: getValue(row, "CarpetArea"),
        areaunits: getValue(row, "AreaUnits"),

        images: item.images,

        user_id: req.user?.id || req.user?._id
      });
    }

    if (insertData.length > 0) {
      await Property.insertMany(insertData);
    }
    fs.unlinkSync(req.file.path);
    return res.render("admin/property/uploadFile", {
      success: "Excel import completed",
      totalRows: rows.length,
      inserted: insertData.length,
      failed: failedRows.length,
      failedRows
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send("Excel import failed");
  }
};


module.exports = {properties,deleteProperty,updateProperty,editProperty,updateStatus,property,submitProperty,propertyUploadFile,postPropertyUploadFile}