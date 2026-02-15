const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // same path definition for views and layout folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);  // defining ejs-mate as the template engine for ejs

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/airbnb");
        console.log("Connected to database");
    }
    catch(error) {
        console.log(error);
        console.log("Some error in database");
    }
}
connect();

app.listen(port, () => {
    console.log("Server listening on port", port);
})

// index route
app.get("/listings", async (req, res, next) => {
    try {
        const allData = await Listing.find({});
        res.render("listing/index.ejs", {allData});
    }
    catch(error) {
        console.log(error);
        next(error);  // error passed to error handling middleware
    }
})

// new route
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
})

// create route
app.post("/listings", async (req, res, next) => {
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.location || !req.body.country) {
        return next(new ExpressError(400, "Send valid data for listing"));
    }  // error passed to error handling middleware if any of the required fields are missing

    let {title, description, price, image, location, country} = req.body;
    try {
        const newListing = new Listing({title, description, price, image, location, country});
        const newData = await newListing.save();
        console.log(newData);
        res.redirect("/listings");
    }
    catch(error) {
        console.log(error);
        next(error);  // error passed to error handling middleware
    }
})

// edit route
app.get("/listings/:id/edit", async (req, res, next) => {
    let {id} = req. params;
    try {
        const data = await Listing.findById(id);
        console.log(data);
        res.render("listing/edit.ejs", {data});
    }
    catch(error) {
        console.log(error);
        next(error);  // error passed to error handling middleware
    }
})

// update route
app.put("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;

    if (!req.body.title || !req.body.description || !req.body.price || !req.body.location || !req.body.country) {
        throw new ExpressError(400, "Send valid data for listing");
    }  // error passed to error handling middleware if any of the required fields are missing

    let {title, description, price, image, location, country} = req.body;
    const editData = await Listing.findByIdAndUpdate(id, {title, description, price, image, location, country}, {new: true}, {runValidtaors: true});
    console.log(editData);
    res.redirect("/listings");
}))  
// error handled by wrapAsync function to avoid try-catch block

// delete route
app.delete("/listings/:id", async (req, res, next) => {
    let {id} = req.params;
    try {
        const deleteData = await Listing.findByIdAndDelete(id);
        console.log(deleteData);
        res.redirect("/listings");
    }
    catch(error) {
        console.log(error);
        next(error);  // error passed to error handling middleware
    }
})

// show route
app.get("/listings/:id", async (req, res, next) => {
    let {id} = req.params;
    try {
        const data = await Listing.findById(id);
        console.log(data);
        res.render("listing/show.ejs", {data});
    }
    catch(error) {
        console.log(error);
        next(error);  // error passed to error handling middleware
    }
})

// wrong route
app.all(/.*/, (req, res) => {  // [/.*/] is a regex that matches all the routes
    throw new ExpressError(404, "Page Not Found");
})

// error handling middleware
app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong"} = err;
    res.status(status).send(message);
})