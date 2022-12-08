// Include all needed modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const neighborhoodRoutes = require('./routes/neighborhoods');
const restaurantRoutes = require('./routes/restaurants');

// Create an Express application
const app = express();
app.use(cors());  // CORS-enabled for all origins!
app.use(express.json()); 

// Define the port the server will accept connections on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});

// Set up mongoose.
const DB_SERVER = process.env.DB_SERVER;
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(DB_SERVER, {useNewUrlParser: true});

// Check if connection succeeded. 
const  dataSource = mongoose.connection;
dataSource.on("error", console.error.bind(console, "connection error: "));
dataSource.once("open", function () {
  console.log("Connected successfully");
});

// Read schemas.
var Neighborhoods = require("./models/neighborhoods.js");
var Restaurants = require("./models/restaurants.js");

// Use routes.
app.use('/', neighborhoodRoutes);
app.use('/', restaurantRoutes);


//DETTA BEHÖVS JU INTE
// Endpoint aggregate en restaurang med info om neighborhood
// app.get('/api/restaurant/:name', async function(req, res) {

//     const restaurantName = req.params.name

//     const aggregate = await Restaurants.aggregate([
//         {$match: { name: restaurantName } },
//         { $lookup: { from: "neighborhoods", localField: "neighborhood", foreignField: "name", as: "hej"} },
//         { $unwind: "$hej"},
//         { $set: { 
//             neighborhoodSize: "$hej.size", 
//             neighborhoodPopulation: "$hej.population"
//         }},
//         { $project: {
//             "_id": 0,
//             "name": 1,
//             "rating": 1,
//             "address": 1,
//             "neighborhood": 1,
//             "owner": 1,
//             "cuisine": 1,
//             "headChef": 1,
//             "priceRange": 1,
//             "michelinStars": 1,
//             "guestsPerYear": 1,
//             "phone": 1,
//             "noOfReviews": 1,
//             "latestReview": 1,
//             "neighborhoodSize": 1,
//             "neighborhoodPopulation": 1
//         }}
//     ])

//     res.status(200).json(aggregate);
// });




