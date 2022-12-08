

const routes = require('express').Router();
var Restaurants = require("../models/restaurants.js");

// Respond to a GET request to the /api/restaurants route.
routes.get('/api/restaurants', async function(req, res) {
    const restaurants = await Restaurants.find();
    res.status(200).json(restaurants);
});

// Respond to a GET request to the /api/restaurants/:name route.
routes.get('/api/restaurants/:name', async function(req, res) {
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
routes.put('/api/restaurants/:name', async function(req, res) {
    
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
routes.post('/api/restaurants', async function(req, res) {

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
routes.delete('/api/restaurants/:name', async function(req, res) {

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

module.exports = routes;