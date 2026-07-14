const { generateListingAI } = require("../services/aiService");

 

module.exports.generateListing = async (req, res) => {

    try {

        const {
            propertyType,
            location,
            style,
            bedrooms,
            bathrooms,
            maxGuests
        } = req.body;

        const aiResponse = await generateListingAI({

            propertyType,
            location,
            style,
            bedrooms,
            bathrooms,
            maxGuests

        });

        return res.status(200).json(aiResponse);

    } catch (err) {

        console.error("AI Listing Error:", err);

        return res.status(500).json({

            success: false,

            message: "Failed to generate AI listing.",

            error: err.message

        });

    }

};
