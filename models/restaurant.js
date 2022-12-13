var mongoose = require("mongoose");

//Schema for restaurants.
var Schema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    rating: {type:Number, min:0, max:5, required:true},
    address: {type:String, required:true},
    neighborhood: {type:String, required:true},
    owner: {type:String, required:true},
    cuisine: {type:String, required:true},
    headChef: {type:String, required:true},
    priceRange: {type:String, required:true},
    michelinStars: {type:Number, min:0, max:3, required:true},
    guestsPerYear: {type:Number, required:true},
    phone: {type:String, required:true},
    noOfReviews: {type:Number, required:true},
    latestReview: {type:String, required:true}
});

// Export the restaurant schema.
module.exports = mongoose.model("restaurant", Schema);
