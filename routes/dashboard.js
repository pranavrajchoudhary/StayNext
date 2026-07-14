const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middlewares");

const dashboardController = require("../controllers/dashboard");

router.get(

    "/",

    isLoggedIn,

    dashboardController.dashboard

);

module.exports = router;