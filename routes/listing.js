const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const  {listingSchema, reviewSchema}  = require("../schema.js");
const Listing = require("../Models/listing.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// new Route
router.get("/new", isLoggedIn, listingController.renderNewform);

router
 .route("/")
 //index.js
 .get( wrapAsync(listingController.index) )
 //Create Route
 .post(isLoggedIn,  upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)
);


router
  .route("/:id")
  //show route
  .get( wrapAsync(listingController.showListing)) 
  //update route
  .put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updateListing))
  //Delete Route 
  .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)
);


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditform));



module.exports = router;