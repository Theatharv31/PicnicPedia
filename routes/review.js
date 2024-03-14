const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const  Review  = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const flash = require("connect-flash");
const {  validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//review route
//POST route
router.post("/", isLoggedIn,  wrapAsync(reviewController.createReview));
 
 
 //Delete Review Route
 router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync (reviewController.deleteReview));

 module.exports = router;