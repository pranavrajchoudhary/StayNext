

const improveListingAI = async (listingData) => {

    const {

        title = "",

        description = "",

        location = "",

        country = ""

    } = listingData;

    // Simulate AI processing delay

    await new Promise(resolve => setTimeout(resolve, 1200));

    const improvedTitle = title.trim() === ""
        ? `Premium Homestay in ${location}`
        : `${title
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())}`;

    const improvedDescription = `

Welcome to ${improvedTitle}.

${description.trim()}

This property has been thoughtfully designed to provide guests with a comfortable and memorable stay. Whether you're visiting with family, friends, or for business, you'll enjoy a peaceful environment, modern amenities, and convenient access to nearby attractions.

StayNest recommends highlighting cleanliness, hospitality, nearby experiences, and unique features to improve guest confidence and booking conversions.

`.trim();

    return {

        success: true,

        data: {

            title: improvedTitle,

            description: improvedDescription,

            amenities: [

                "Free Wi-Fi",

                "Free Parking",

                "Air Conditioning",

                "Fully Equipped Kitchen",

                "Smart TV",

                "Power Backup",

                "Dedicated Workspace",

                "Hot Water",

                "Garden Access"

            ],

            houseRules: [

                "Check-in after 2:00 PM",

                "Check-out before 11:00 AM",

                "No Smoking Indoors",

                "No Loud Music After 10 PM",

                "Government ID Required During Check-in"

            ],

            seoTags: [

                location,

                country,

                "StayNest",

                "Homestay",

                "Vacation Rental",

                "Weekend Getaway",

                "Family Stay"

            ]

        }

    };

};

module.exports = {

    improveListingAI

};