


const routes = require('express').Router();
var Neighborhoods = require("../models/neighborhoods.js");


// krav endpoint 1 
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


// Respond to a GET request to the /api/neighborhoods route.
routes.get('/api/neighborhoods', async function(req, res) {
    const neighborhoods = await Neighborhoods.find();
    res.status(200).json(neighborhoods);
});


//Endpoint  få alla restauranger i ett visst area och neighborhoodet
// Respond to a GET request to the /api/neighborhoods route.
routes.get('/api/neighborhoods/:neighborhood', async function(req, res) {

    const neighborhoodName = req.params.neighborhood;

    const neighborhoodWithRestaurants = await Neighborhoods.aggregate([{
        $match: { name: neighborhoodName }},
        {$lookup: {
            from: "restaurants",
            localField: "name",
            foreignField: "neighborhood",
            as: "restaurants"
        }
    }])


    //obs här har jag inget som kollar att man faktiskt har skrivit in ett namn som finns
    res.status(200).json(neighborhoodWithRestaurants[0]);
    
    
});


module.exports = routes;