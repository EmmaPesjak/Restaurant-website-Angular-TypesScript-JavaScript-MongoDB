/*Schema for neighborhoods.*/

var mongoose = require("mongoose");

var Schema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    size: Number,
    population: Number
});

module.exports = mongoose.model("neighborhoods", Schema);