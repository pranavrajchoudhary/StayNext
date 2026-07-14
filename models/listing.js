const mongoose = require("mongoose");
const review = require("./review");

const schema = mongoose.Schema;

const listingSchema = new schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    image: {

        filename: {
            type: String,
            default: "listingimage"
        },

        url: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vlxc23whnpsnYqqppUQ0_dMGVfPsde6DHw&s",
            set: (v) =>
                v === ""
                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vlxc23whnpsnYqqppUQ0_dMGVfPsde6DHw&s"
                    : v
        }

    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    /* ------------------------------
       AI Generated Suggestions
    ------------------------------ */

    amenities: [
        {
            type: String,
            trim: true
        }
    ],

    houseRules: [
        {
            type: String,
            trim: true
        }
    ],

    seoTags: [
        {
            type: String,
            trim: true
        }
    ],

    /* ------------------------------ */

    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "review"
        }
    ],

    owner: {
        type: schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {

        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number],
            default: [0, 0]
        }

    }

},
{
    timestamps: true
});

listingSchema.post("findOneAndDelete", async (listing) => {

    if (!listing) return;

    await review.deleteMany({

        _id: {

            $in: listing.reviews

        }

    });

});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;