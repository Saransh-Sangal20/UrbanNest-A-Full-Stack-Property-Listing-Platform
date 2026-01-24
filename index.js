const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings", async (req,res) => {
    try {
        const allData = await Listing.find({});
        res.render("listing/index.ejs", {allData});
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})

// new route
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
})

// create route
app.post("/listings", async (req,res) => {
    let {title, description, price, image, location, country} = req.body;
    try {
        const newListing = new Listing({title, description, price, image, location, country});
        const newData = await newListing.save();
        console.log(newData);
        res.redirect("/listings");
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req. params;
    try {
        const data = await Listing.findById(id);
        console.log(data);
        res.render("listing/edit.ejs", {data});
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})

// update route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let {title, description, price, image, location, country} = req.body;
    try {
       const editData = await Listing.findByIdAndUpdate(id, {title, description, price, image, location, country}, {new: true}, {runValidtaors: true});
       console.log(editData);
       res.redirect("/listings");
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})

// delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    try {
        const deleteData = await Listing.findByIdAndDelete(id);
        console.log(deleteData);
        res.redirect("/listings");
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})

// show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    try {
        const data = await Listing.findById(id);
        console.log(data);
        res.render("listing/show.ejs", {data});
    }
    catch(error) {
        console.log(error);
        res.send("Some error in database");
    }
})