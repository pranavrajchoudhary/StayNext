const Listing = require("../models/listing");
const Order = require("../models/Order");

module.exports.dashboard = async (req, res) => {

    try {

        const listings = await Listing.find({
            owner: req.user._id
        });

        const listingIds = listings.map(l => l._id);

        const orders = await Order.find({
            listing: {
                $in: listingIds
            }
        })
        .populate("listing")
        .sort({ createdAt: -1 });

        const totalRevenue = orders
            .filter(o => o.status === "paid")
            .reduce((sum, o) => sum + o.totalFare, 0);

        const pendingBookings = orders.filter(o => o.status === "pending");

        const paidBookings = orders.filter(o => o.status === "paid");

        const today = new Date();

        today.setHours(0,0,0,0);

        const arrivalsToday = paidBookings.filter(o => {

            const d = new Date(o.fromDate);

            d.setHours(0,0,0,0);

            return d.getTime() === today.getTime();

        });

        res.render("dashboard/index",{

            listings,

            orders,

            totalRevenue,

            pendingBookings,

            arrivalsToday

        });

    }

    catch(err){

        console.log(err);

        req.flash("error","Unable to load dashboard.");

        res.redirect("/");

    }

};