const routes = require('express').Router();
var Neighborhoods = require("../models/neighborhood.js");

/**
 * Respond to a GET request to the /api/all route (endpoint requrement 1).
 * Gets all information about all neighborhoods and their restaurants. 
 */ 
routes.get('/api/all', async function(req, res) {
    const neighborhoodsWithRestaurants = await Neighborhoods.aggregate([{
        $lookup: {
            from: "restaurants",
            localField: "name",
            foreignField: "neighborhood",
            as: "restaurants"
        }
    }])
    res.status(200).json(neighborhoodsWithRestaurants);
});

// Respond to a GET request to the /api/neighborhoods route. Not currently used in the web app.
routes.get('/api/neighborhoods', async function(req, res) {
    const neighborhoods = await Neighborhoods.find();
    res.status(200).json(neighborhoods);
});

/**
 * Respond to a GET request to the /api/neighborhoods/:neighborhood route (endpoint requirement 2).
 * Gets all information about a specific neighborhood and its restaurants.
 */
routes.get('/api/neighborhoods/:neighborhood', async function(req, res) {

    // Get the name from the parameter.
    const neighborhoodName = req.params.neighborhood;

    // Find the neighborhood with the name.
    const neighborhood = await Neighborhoods.findOne({
        name: neighborhoodName
    });

    // Check if the neighborhood exists.
    if (neighborhood) {
        // If so, aggregate and reply.
        const neighborhoodWithRestaurants = await Neighborhoods.aggregate([{
                $match: { name: neighborhoodName }},
                {$lookup: {
                    from: "restaurants",
                    localField: "name",
                    foreignField: "neighborhood",
                    as: "restaurants"
                }
            }])
            res.status(200).json(neighborhoodWithRestaurants[0]);
    } else {
        // Return an empty JSON object if the neighborhood did not exist.
        res.status(200).json({});
    }
});

module.exports = routes;
