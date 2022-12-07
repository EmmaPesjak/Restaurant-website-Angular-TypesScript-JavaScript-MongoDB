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
// routes.get('/api/neighborhoods', async function(req, res) {
//     const neighborhoods = await Neighborhoods.find();
//     res.status(200).json(neighborhoods);
// });

// Respond to a GET request to the /api/restaurants route.
app.get('/api/restaurants', async function(req, res) {
    const restaurants = await Restaurants.find();
    res.status(200).json(restaurants);
});

// Respond to a GET request to the /api/restaurants/:name route.
app.get('/api/restaurants/:name', async function(req, res) {
    // Get the name from the parameter.
    var name = req.params.name;

    // Find the restaurant with the name.
    var restaurant = await Restaurants.findOne({
        name: name
    });
   
    // Check if the restaurant existed.
    if (restaurant) {
    res.status(200).json(restaurant);
    } else {
    // Return an empty JSON object if the restaurant did not exist.
    res.status(200).json({});
    }
});

// Respond to a PUT request to the /api/restaurants/:name route.
app.put('/api/restaurants/:name', async function(req, res) {
    
    // Get the name and owner from the parameters.
    var name = req.params.name;
    const owner = req.body.owner;

    // Find the restaurant with the name.
    var restaurant = await Restaurants.findOne({
        name: name
    });

    // Check if the restaurant existed, update and reply.
    if (restaurant) {
        await Restaurants.findOneAndUpdate({name : name}, {owner : owner});
        res.status(200).json(await Restaurants.findOne({
            name: name
        }));
    } else {
        res.status(404).json({error: "Restaurant does not exist"}); 
    }
});

// Respond to a POST request to the /api/restaurants route.
app.post('/api/restaurants', async function(req, res) {

    // Get all of the parameters.
    const name = req.body.name;
    const rating = req.body.rating;
    const address = req.body.address;
    const neighborhood = req.body.neighborhood;
    const owner= req.body.owner;
    const cuisine = req.body.cuisine;
    const headChef = req.body.headChef;
    const priceRange = req.body.priceRange;
    const michelinStars = req.body.michelinStars;
    const guestsPerYear = req.body.guestsPerYear;
    const phone = req.body.phone;
    const noOfReviews = req.body.noOfReviews;
    const latestReview = req.body.latestReview;

    // Find the course in the course list.
    const restaurant = await Restaurants.findOne({
        name: name
    });

    // Check if the restaurant already exists.
    if (restaurant) {
        res.status(409).json({error: "Restaurant already exists"});
    } else {
        // Else add the restaurant.
        var restaurantToAdd = new Restaurants();

        // Make sure parameters exist and make an object to add.
        if (name && rating && address && neighborhood && owner && cuisine && headChef && priceRange &&
            michelinStars && guestsPerYear && phone && noOfReviews && latestReview) {
            restaurantToAdd.name = name;
            restaurantToAdd.rating = rating;
            restaurantToAdd.address = address;
            restaurantToAdd.neighborhood = neighborhood;
            restaurantToAdd.owner = owner;
            restaurantToAdd.cuisine = cuisine;
            restaurantToAdd.headChef = headChef;
            restaurantToAdd.priceRange = priceRange;
            restaurantToAdd.michelinStars = michelinStars;
            restaurantToAdd.guestsPerYear = guestsPerYear;
            restaurantToAdd.phone = phone;
            restaurantToAdd.noOfReviews = noOfReviews;
            restaurantToAdd.latestReview = latestReview;

            // Add the restaurant.
            if (restaurantToAdd) {
                await restaurantToAdd.save();
            }

            // Find the restaurant and reply.
            const myAddedRestaurant = await Restaurants.findOne({
                name: name
            });
            res.status(201).json(myAddedRestaurant);
        } else {
            res.status(409).json({error: "Not all parameters included"});
        }
    }
});

// Respond to a DELETE request to the /api/restaurants/:name route.
app.delete('/api/restaurants/:name', async function(req, res) {

    // Get the restaurant name from the parameter.
    const name = req.params.name;

    // Find the restaurant with the name.
    var restaurant = await Restaurants.findOne({
        name: name
    });

    // Check if the restaurant existed and delete if so.
    if (restaurant) {
        await Restaurants.deleteOne({
            name: name
        })
        res.status(200).json(restaurant);
	} else {
            res.status(404).json({error: "Restaurant does not exist"});
    }
});




// Endpoint aggregate en restaurang med info om neighborhood
app.get('/api/restaurant/:name', async function(req, res) {

    const restaurantName = req.params.name

    const aggregate = await Restaurants.aggregate([
        {$match: { name: restaurantName } },
        { $lookup: { from: "neighborhoods", localField: "neighborhood", foreignField: "name", as: "hej"} },
        { $unwind: "$hej"},
        { $set: { 
            neighborhoodSize: "$hej.size", 
            neighborhoodPopulation: "$hej.population"
        }},
        { $project: {
            "_id": 0,
            "name": 1,
            "rating": 1,
            "address": 1,
            "neighborhood": 1,
            "owner": 1,
            "cuisine": 1,
            "headChef": 1,
            "priceRange": 1,
            "michelinStars": 1,
            "guestsPerYear": 1,
            "phone": 1,
            "noOfReviews": 1,
            "latestReview": 1,
            "neighborhoodSize": 1,
            "neighborhoodPopulation": 1
        }}
    ])

    res.status(200).json(aggregate);
});





// blir ju inte helt rätt 
//Endpoint  få alla restauranger i ett visst area och neighborhoodet
// Respond to a GET request to the /api/neighborhoods route.
app.get('/api/neighborhoods/:neighborhood', async function(req, res) {

    const neighborhoodName = req.params.neighborhood;

    const neighborhood = await Neighborhoods.findOne({
        name: neighborhoodName
    });

    const allNeighborhoodRestaurants = await Restaurants
    .find({neighborhood: neighborhoodName});


    const hej = await Neighborhoods.aggregate([
        {$match: { name: neighborhoodName } },
        {$addFields: {
            restaurants: { HEjum: "homework" } 
            }
        }
        ]);

    console.log(hej)

    res.status(200).json({neighborhood, allNeighborhoodRestaurants});
});


//fungerar inte
// krav endpoint 1 OBS här behöver jag fixa så de delas in i brooklyn med dess restauranger etc.
app.get('/api/all', async function(req, res) {
    const restaurants = await Restaurants.find();
    

    const aggro = await Neighborhoods.aggregate( [
        {
          $addFields: {
            totalHomework: { Hej: "homework" } ,
            totalQuiz: { $sum: "$quiz" }
          }
        }
     ] )

    const neighborhoods = await Neighborhoods.find();

    console.log(aggro)

    console.log(neighborhoods)

    neighborhoods.forEach(async neighborhood => {
        console.log(neighborhood)

        const allNeighborhoodRestaurants = await Restaurants
        .find({neighborhood: neighborhood.name})

        

        // hej.push({
        //     neighborhood: neighborhood,
        //     restaurants: allNeighborhoodRestaurants
        // })
    });

    for (var neighborhood in neighborhoods) {

        //console.log(neighborhood);


        const allNeighborhoodRestaurants = await Restaurants
        .find({neighborhood: neighborhood.name})

        //hej.({neighborhood, allNeighborhoodRestaurants})

    }

    console.log(hej)


    res.status(200).json(aggro);
});