// controllers/paymentController.js
const Listing = require("../models/listing");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

 
module.exports.fetch = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("user/checkout.ejs", { listing });
  } catch (err) {
    console.error("Fetch Checkout Error:", err);
    res.status(500).send("Something went wrong");
  }
};

 
// module.exports.checkout = async (req, res) => {
//   try {
//     const listingId = req.params.id;
//     const listing = await Listing.findById(listingId);
//     if (!listing) return res.status(404).send("Listing not found");

//     const {
//       fromDate, toDate, guests,
//       guestNames, guestAges,
//       email, phone, requests,
//       totalFare
//     } = req.body;

     
//     const order = new Order({
//       listing: listing._id,
//       user: req.user._id, 
//       fromDate, toDate, guests,
//       guestNames, guestAges,
//       email, phone, requests,
//       totalFare,
//       status: "pending"
//     });

//     await order.save();

//     // Stripe Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: listing.title,
//             },
//             unit_amount: totalFare * 100, // paise me convert
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `https://wanderlust-nxrg.onrender.com/payment-success?oid=${order._id}`,
//       cancel_url: `https://wanderlust-nxrg.onrender.com/listings/${listing._id}/checkout`,
//     });

//     // Redirect to Stripe payment page
//     res.redirect(session.url);
//   } catch (err) {
//     console.error("Checkout Error:", err);
//     res.status(500).send("Payment initiation failed");
//   }
// };
module.exports.checkout = async (req, res) => {

  try {

    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {

      req.flash("error", "Property not found.");

      return res.redirect("/listings");

    }

    const {

      fromDate,
      toDate,
      guests,
      guestNames,
      guestAges,
      email,
      phone,
      requests

    } = req.body;



    const checkIn = new Date(fromDate);

    const checkOut = new Date(toDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);



    /* ---------------------------------------
       Basic Date Validation
    --------------------------------------- */

    if (checkIn < today) {

      req.flash("error", "Past dates cannot be booked.");

      return res.redirect(`/listings/${listingId}/checkout`);

    }

    if (checkOut <= checkIn) {

      req.flash("error", "Check-out must be after check-in.");

      return res.redirect(`/listings/${listingId}/checkout`);

    }



    /* ---------------------------------------
       Overlap Booking Validation
    --------------------------------------- */

    const overlapBooking = await Order.findOne({

      listing: listingId,

      status: {

        $in: ["pending", "paid"]

      },

      fromDate: {

        $lt: checkOut

      },

      toDate: {

        $gt: checkIn

      }

    });

    if (overlapBooking) {

      req.flash(

        "error",

        "Selected dates are already booked. Please choose different dates."

      );

      return res.redirect(`/listings/${listingId}/checkout`);

    }



    /* ---------------------------------------
       Calculate Total Fare On Server
    --------------------------------------- */

    const nights = Math.ceil(

      (checkOut - checkIn) /

      (1000 * 60 * 60 * 24)

    );

    const serviceFee = 500;

    const tax = 0.18;

    const subtotal = nights * listing.price;

    const totalFare = Math.round(

      subtotal +

      serviceFee +

      subtotal * tax

    );



    /* ---------------------------------------
       Create Booking
    --------------------------------------- */

    const order = new Order({

      listing: listing._id,

      user: req.user._id,

      fromDate: checkIn,

      toDate: checkOut,

      guests,

      guestNames,

      guestAges,

      email,

      phone,

      requests,

      totalFare,

      status: "pending"

    });

    await order.save();



    /* ---------------------------------------
       Stripe Checkout
    --------------------------------------- */

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      mode: "payment",

      line_items: [

        {

          price_data: {

            currency: "inr",

            product_data: {

              name: listing.title

            },

            unit_amount: totalFare * 100

          },

          quantity: 1

        }

      ],

      success_url: `https://wanderlust-nxrg.onrender.com/payment-success?oid=${order._id}`,

      cancel_url: `https://wanderlust-nxrg.onrender.com/listings/${listing._id}/checkout`

    });



    return res.redirect(session.url);

  }

  catch (err) {

    console.error("Checkout Error:", err);

    req.flash("error", "Unable to process booking.");

    return res.redirect("back");

  }

};
// STEP 3: Handle success
module.exports.paymentSuccess = async (req, res) => {
  try {
    const { oid } = req.query;

    const order = await Order.findByIdAndUpdate(
      oid,
      { status: "paid" },
      { new: true }
    ).populate("listing");

    if (!order) return res.status(404).send("Order not found");

   

    res.render("user/success.ejs", { order });
  } catch (err) {
    
    res.status(500).send("Error in success page");
  }
};
