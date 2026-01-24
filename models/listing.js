const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String,
        default:"https://images.unsplash.com/photo-1768409234914-96f61529b7e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
        set: (v) => v === ""? "https://images.unsplash.com/photo-1768409234914-96f61529b7e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8": v
    },  // set constraint is used to transform the value given before saving to database
    location: {
        type: String
    },
    country: {
        type: String
    }
})
// set is used when user does not provide any image link in input field
// default is used when user does not pass that field to database, even if its provided

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;