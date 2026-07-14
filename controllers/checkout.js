// controllers/paymentController.js
const Listing = require("../models/listing");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendMail = require("../utils/sendMail");
 
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

    const bookingReference =
`STN-${Date.now().toString().slice(-8)}`;

const order = await Order.findByIdAndUpdate(

    oid,

    {

        status: "paid",

        bookingReference

    },

    {

        new: true

    }

)

.populate("listing")

.populate("user");

    if (!order) return res.status(404).send("Order not found");
    console.log("\n========== ORDER DATA ==========");
console.log(order);
console.log("Email:", order.email);
console.log("Booking Ref:", order.bookingReference);
console.log("Listing:", order.listing?.title);
console.log("===============================\n");
console.log("Calling sendMail...");
    await sendMail(

    order.email,

    "Booking Confirmed | StayNest",

    `

    <div style="font-family:Arial,sans-serif;padding:25px;">

        <h2 style="color:#ff5a3d;">

            Booking Confirmed

        </h2>

        <p>

            Hello,

        </p>

        <p>

            Your booking has been confirmed successfully.

        </p>

        <hr>

        <p>

            <strong>Booking ID:</strong>

            ${order.bookingReference}

        </p>

        <p>

            <strong>Property:</strong>

            ${order.listing.title}

        </p>

        <p>

            <strong>Check In:</strong>

            ${new Date(order.fromDate).toLocaleDateString("en-IN")}

        </p>

        <p>

            <strong>Check Out:</strong>

            ${new Date(order.toDate).toLocaleDateString("en-IN")}

        </p>

        <p>

            <strong>Guests:</strong>

            ${order.guests}

        </p>

        <p>

            <strong>Total Paid:</strong>

            ₹ ${order.totalFare}

        </p>

        <hr>

        <p>

            Thank you for choosing StayNest.

        </p>

    </div>

    `

);
   console.log("sendMail Finished.");

    res.render("user/success.ejs", { order });
  } catch (err) {

    console.error("========== PAYMENT SUCCESS ERROR ==========");
    console.error(err);
    console.error("===========================================");

    res.status(500).send("Error in success page");

}
};
