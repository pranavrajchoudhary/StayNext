// const Joi = require('joi');



// module.exports.listingSchema = Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().allow("",null), // URL validation
//     price: Joi.number().min(0).required(),
//     location: Joi.string().required(),
//     country: Joi.string().required()
// });

// module.exports.reviewSchemaV = Joi.object({
//     comment : Joi.string().required(),
//     rating : Joi.number().min(0).max(5).required()
// })

const Joi = require("joi");

module.exports.listingSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(5)
        .max(120)
        .required(),

    description: Joi.string()
        .trim()
        .min(20)
        .max(3000)
        .required(),

    image: Joi.string().allow("", null),

    price: Joi.number()
        .min(0)
        .required(),

    location: Joi.string()
        .trim()
        .required(),

    country: Joi.string()
        .trim()
        .required(),

    amenities: Joi.array()
        .items(Joi.string().trim())
        .default([]),

    houseRules: Joi.array()
        .items(Joi.string().trim())
        .default([]),

    seoTags: Joi.array()
        .items(Joi.string().trim())
        .default([])

});

module.exports.reviewSchemaV = Joi.object({

    comment: Joi.string()
        .trim()
        .min(3)
        .max(1000)
        .required(),

    rating: Joi.number()
        .min(1)
        .max(5)
        .required()

});