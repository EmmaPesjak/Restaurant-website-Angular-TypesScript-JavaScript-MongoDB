const routes = require('express').Router();
const Restaurants = require("../models/restaurant.js");

// Respond to a GET request to the /api/restaurants route.
routes.get('/api/restaurants', async function(req, res) {
    const restaurants = await Restaurants.find();
    res.status(200).json(restaurants);
});

// Respond to a GET request to the /api/restaurants/:name route. Not currently used in the web app.
routes.get('/api/restaurants/:name', async function(req, res) {
    // Get the name from the parameter.
    const name = req.params.name;

    // Find the restaurant with the name.
    const restaurant = await Restaurants.findOne({
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

// Respond to a PUT request to the /api/restaurants/:name route (endpoint requrement 4).
routes.put('/api/restaurants/:name', async function(req, res) {
    
    // Get the parameters.
    const name = req.params.name;
    const michelinStars = req.body.michelinStars;

    // Find the restaurant with the name.
    const restaurant = await Restaurants.findOne({
        name: name
    });

    // Check if the restaurant existed, update and reply.
    if (restaurant) {
        await Restaurants.findOneAndUpdate({name : name}, {michelinStars : michelinStars});
        res.status(200).json(await Restaurants.findOne({
            name: name
        }));
    } else {
        res.status(404).json({error: "Restaurant does not exist"}); 
    }
});

// Respond to a POST request to the /api/restaurants route (endpoint requrement 3).
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
        res.status(409).json({error: "Restaurant already exists, please select a unique name."});
    } else {
        // Else add the restaurant.
        const restaurantToAdd = new Restaurants();

        // Make sure parameters exist, is not null or undefined, and make an object to add.
        if (name != null && rating != null && address != null && neighborhood != null && owner != null && cuisine != null 
            && headChef != null && priceRange != null && michelinStars != null && guestsPerYear != null  && phone != null 
            && noOfReviews != null  && latestReview != null ) {
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
            res.status(400).json({error: "Not all parameters included"});
        }
    }
});

// Respond to a DELETE request to the /api/restaurants/:name route (endpoint requrement 5).
routes.delete('/api/restaurants/:name', async function(req, res) {

    // Get the restaurant name from the parameter.
    const name = req.params.name;

    // Find the restaurant with the name.
    const restaurant = await Restaurants.findOne({
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
