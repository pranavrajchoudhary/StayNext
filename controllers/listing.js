const Listing = require('../models/listing');
const axios = require("axios");


module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.new = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found !")
        return res.redirect("/listings")
    } else {


        res.render("listings/show.ejs", { thisListing: listing });

    }
};

module.exports.edit = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let ogimg = listing.image.url;
    ogimg = await ogimg.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing, ogimg });
};

module.exports.create = async (req, res) => {
    
    //const { title, description, image, price, location, country } = req.body;
    const {

    title,
    description,
    price,
    location,
    country,

    amenities = [],
    houseRules = [],
    seoTags = []

} = req.body;
let finalAmenities = amenities;
let finalHouseRules = houseRules;
let finalSeoTags = seoTags;

if (typeof finalAmenities === "string") {
    try {
        finalAmenities = JSON.parse(finalAmenities);
    } catch {
        finalAmenities = [];
    }
}

if (typeof finalHouseRules === "string") {
    try {
        finalHouseRules = JSON.parse(finalHouseRules);
    } catch {
        finalHouseRules = [];
    }
}

if (typeof finalSeoTags === "string") {
    try {
        finalSeoTags = JSON.parse(finalSeoTags);
    } catch {
        finalSeoTags = [];
    }
}
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: `${location}, ${country}`,
            format: "json",
            limit: 1
        },
        headers: { 'User-Agent': 'AirbnbClone/1.0' }
    });
    const coords = geoRes.data[0]
        ? [parseFloat(geoRes.data[0].lon), parseFloat(geoRes.data[0].lat)]
        : [0, 0]; // fallback


    // const newListing = new Listing({
    //     title, description, image: { url: req.file.path, filename: req.file.filename },
    //     price, location, country,geometry: { type: "Point", coordinates: coords }
    // });
    const newListing = new Listing({

    title,

    description,
    image: req.file
        ? {
            url: req.file.path,
            filename: req.file.filename
        }
        : undefined,

    price,

    location,

    country,

   amenities: finalAmenities,

houseRules: finalHouseRules,

seoTags: finalSeoTags,

    geometry: {

        type: "Point",

        coordinates: coords

    }

});
    newListing.owner = req.user._id;
    await newListing.save();
req.flash("success", "Property published successfully.");    res.redirect(`/listings/${newListing._id}`);
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    //const { title, description, price, location, country } = req.body;
    const {

    title,
    description,
    price,
    location,
    country,

    amenities = [],
    houseRules = [],
    seoTags = []

} = req.body;
let finalAmenities = amenities;
let finalHouseRules = houseRules;
let finalSeoTags = seoTags;

if (typeof finalAmenities === "string") {
    try {
        finalAmenities = JSON.parse(finalAmenities);
    } catch {
        finalAmenities = [];
    }
}

if (typeof finalHouseRules === "string") {
    try {
        finalHouseRules = JSON.parse(finalHouseRules);
    } catch {
        finalHouseRules = [];
    }
}

if (typeof finalSeoTags === "string") {
    try {
        finalSeoTags = JSON.parse(finalSeoTags);
    } catch {
        finalSeoTags = [];
    }
}
    const listing = await Listing.findById(id);
    let imageData = listing.image;
    if (req.file) {
        imageData = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: `${location}, ${country}`,
            format: "json",
            limit: 1
        },
        headers: { 'User-Agent': 'AirbnbClone/1.0' }
    });
    const coords = geoRes.data[0]
        ? [parseFloat(geoRes.data[0].lon), parseFloat(geoRes.data[0].lat)]
        : [0, 0]; // fallback
    // await Listing.findByIdAndUpdate(id, {
    //     title,//title here or name
    //     description,
    //     image: imageData,
    //     price,
    //     location,
    //     country,
    //     geometry: { type: "Point", coordinates: coords }
    // });
    await Listing.findByIdAndUpdate(id, {

    title,

    description,

    image: imageData,

    price,

    location,

    country,

    amenities: finalAmenities,

houseRules: finalHouseRules,

seoTags: finalSeoTags,

    geometry: {

        type: "Point",

        coordinates: coords

    }

});
req.flash("success", "Property updated successfully.");
    res.redirect(`/listings/${id}`);
};


module.exports.delete = async (req, res) => {
    let rslt = await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", `Deleted ${rslt.title} Successfully!`)
    res.redirect("/listings");
};
