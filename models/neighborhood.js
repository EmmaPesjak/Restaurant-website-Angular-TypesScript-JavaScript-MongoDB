const mongoose = require("mongoose");

// Schema for neighborhood.
const Schema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    size: {type:Number, required:true},
    population: {type:Number, required:true}
});

// Export the neighborhood schema.
module.exports = mongoose.model("neighborhood", Schema);
