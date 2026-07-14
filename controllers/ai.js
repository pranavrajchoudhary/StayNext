const { improveListingAI } = require("../services/aiService");

 
module.exports.improveListing = async (req, res) => {

    try {

        const {

            title,
            description,
            location,
            country

        } = req.body;

        if (!description || description.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Please enter a property description."

            });

        }

        const aiResponse = await improveListingAI({

            title,

            description,

            location,

            country

        });

        return res.status(200).json(aiResponse);

    }

    catch (err) {

        console.error("AI Improvement Error:", err);

        return res.status(500).json({

            success: false,

            message: "Unable to improve listing.",

            error: err.message

        });

    }

};