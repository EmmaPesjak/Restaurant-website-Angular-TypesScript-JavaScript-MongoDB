/*Schema for restaurants.*/

var mongoose = require("mongoose");

var Schema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    rating: Number,
    adress: String,
    neighborhood: String,
    owner: String,
    cuisine: String,
    headChef: String,
    priceRange: String,
    michelinStars: Number,
    guestsPerYear: Number,
    phone: String,
    noOfReviews: Number,
    latestReview: String
});

module.exports = mongoose.model("restaurants", Schema);