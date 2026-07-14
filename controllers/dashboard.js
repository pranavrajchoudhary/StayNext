const Listing = require("../models/listing");

const Order = require("../models/Order");

module.exports.dashboard = async (req, res) => {

    try {

        const ownerId = req.user._id;

        const listings = await Listing.find({

            owner: ownerId

        });

        const listingIds = listings.map(listing => listing._id);

        const orders = await Order.find({

            listing: {

                $in: listingIds

            }

        })

        .populate("listing")

        .populate("user")

        .sort({

            createdAt: -1

        });

        const totalProperties = listings.length;

        const totalBookings = orders.length;

        const activeBookings = orders.filter(order =>

            order.status === "paid"

        ).length;

        const pendingBookings = orders.filter(order =>

            order.status === "pending"

        ).length;

        const cancelledBookings = orders.filter(order =>

            order.status === "cancelled"

        ).length;

        const totalRevenue = orders

            .filter(order => order.status === "paid")

            .reduce(

                (sum, order) => sum + order.totalFare,

                0

            );

        const now = new Date();

        const monthlyRevenue = orders

            .filter(order =>

                order.status === "paid" &&

                new Date(order.createdAt).getMonth() === now.getMonth() &&

                new Date(order.createdAt).getFullYear() === now.getFullYear()

            )

            .reduce(

                (sum, order) => sum + order.totalFare,

                0

            );

        res.render(

            "dashboard/index",

            {

                listings,

                orders,

                stats: {

                    totalProperties,

                    totalBookings,

                    activeBookings,

                    pendingBookings,

                    cancelledBookings,

                    totalRevenue,

                    monthlyRevenue

                }

            }

        );

    }

    catch(err){

        console.log(err);

        req.flash(

            "error",

            "Unable to load dashboard."

        );

        res.redirect("/");

    }

};