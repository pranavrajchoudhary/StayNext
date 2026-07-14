const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai");
const { isLoggedIn } = require("../middlewares");


router.post(
    "/improve-listing",
    isLoggedIn,
    aiController.improveListing
);

module.exports = router;