if(process.env_NODE_ENV != "production"){
    require('dotenv').config();
}


console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const  {listingSchema, reviewSchema}  = require("./schema.js");
const  Review  = require("./Models/review.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js"); 
const isLoggedIn = require("./middleware.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require("connect-flash");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecratecode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //No. of Mili seconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

/*app.get("/", (req, res) => {
    res.send("Hi i Am root"); 
});
*/

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

/*app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email : "atharv.isapure@gmail.com",
        username : "Atharv"
    });
    
    let registerUser = await User.register(fakeUser, "Pass123" );
    res.send(registerUser);

});
*/


const validateListing = (req, res, next) => {
    let {error } =listingSchema.validate(req.body);
   let errMsg = error.details.map((el) => el.message).join(",");
   if(error){
    throw new ExpressError(400, errMsg);
   }
   else{
    next();
   }

};

const validateReview = (req, res, next) => {
    let {error } =reviewSchema.validate(req.body);
   let errMsg = error.details.map((el) => el.message).join(",");
   if(error && error.details){
    throw new ExpressError(400, errMsg);
   }
   else{
    next();
   }

};


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);






/*app.get("/testListing", async(req, res) => {
    let sampleListing = new Listing({
        title: "My Home",
        description : "First Home",
        price : 1500,
        location: "Pune, Maharashatra",
        country: "India",

         
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Test Succesful");

});
*/

// Error handling 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
} ); 

app.use((err, req, res, next) => {
    let{statusCode = 500, message =  "Something Wrong"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("server is listening at 8080");
});