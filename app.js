// Include all needed modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

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





//OBS 
//OBS 
// ALLA ENDPOINTS MÅSTE FLYTTAS TILL SEPARATA ROUTES FILER
//OBS 
//OBS 

// Respond to a GET request to the /api/neighborhoods route.
app.get('/api/neighborhoods', async function(req, res) {
    const neighborhoods = await Neighborhoods.find();
    res.status(200).json(neighborhoods);
});

// Respond to a GET request to the /api/restaurants route.
app.get('/api/restaurants', async function(req, res) {
    const restaurants = await Restaurants.find();
    res.status(200).json(restaurants);
});

// Respond to a GET request to the /api/restaurants/:name route.
app.get('/api/restaurants/:name', async function(req, res) {
    // Get the course code from the parameter.
    var name = req.params.name;

    // Find the course with the course code.
    var restaurant = await Restaurants.findOne({
        name: name
    });
   
    // Check if the course existed.
    if (restaurant) {
    res.status(200).json(restaurant);
    } else {
    // Return an empty JSON object if the course did not exist.
    res.status(200).json({});
    }
});

// Respond to a DELETE request to the /api/restaurants/:name route.
app.delete('/api/restaurants/:name', async function(req, res) {

    // Get the course code from the parameter.
    const name = req.params.name;

    // Find the course with the course code.
    var restaurant = await Restaurants.findOne({
        name: name
    });

    // Check if the course existed and delete if so.
    if (restaurant) {
        await Restaurants.deleteOne({
            name: name
        })
        res.status(200).json(restaurant);
	} else {
            res.status(404).json({error: "Restaurant does not exist"});
    }
});


//Endpoint PUT
//Endpoint POST
//Endpoint AGGREGATE/POPULATE typ få alla restauranger i ett visst area