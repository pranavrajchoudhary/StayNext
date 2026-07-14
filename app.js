const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
require("dotenv").config();

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user");
const checkoutRouter = require("./routes/checkout")
const orderRoutes = require("./routes/Orders");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const { send } = require("process");
const { error } = require("console");
const dburl = process.env.ATLAS_URL
const Order = require("./models/Order")
const mongoURL = process.env.MONGO_URI;
const aiRouter = require("./routes/ai");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));


async function main() {
    await mongoose.connect(dburl);
}
main().then(() => console.log("connectedToDb")).catch(err => console.log(err));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",(err)=>{
    console.log("Session Error -Mongo",err);
})

const sessionOpt = {
    store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}


app.use(session(sessionOpt));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;  
    next();
})

 



// Routes
const dashboardRouter = require("./routes/dashboard");

app.use("/dashboard", dashboardRouter);
app.use("/", listingsRouter);
app.use("/listings", reviewsRouter);
app.use("/",userRouter);
app.use("/listings",checkoutRouter)
app.use("/ai", aiRouter);
app.get("/payment-success", async (req, res) => {
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
    console.error("Payment Success Error:", err);
    res.status(500).send("Error in success page");
  }
});

app.use("/orders", orderRoutes);

const sendMail = require("./utils/sendMail");

app.get("/test-email", async (req, res) => {

    await sendMail(

        process.env.EMAIL_USER,

        "StayNest Email Test",

        `
        <h2>StayNest Email Test</h2>

        <p>If you're reading this, Nodemailer is configured correctly.</p>

        <p>Your project can now send booking confirmation emails.</p>
        `
    );

    res.send("Email Sent Successfully.");

});

// Catch-all 404
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found !!!"));
});


// Error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);  
    }

    if (err.name === "ValidationError") err.message = "Invalid Entries";

    let { status = 500, message = "Unknown Error Occurred" } = err;

    res.status(status).render("extras/error.ejs", { err });
});

app.listen(8080, () => {
    console.log("Server is running at: http://localhost:8080/listings");
});
