
// Detta fungerar inte

const routes = require('express').Router();
var Neighborhoods = require("../models/neighborhoods.js");

// Respond to a GET request to the /api/neighborhoods route.
routes.get('/api/neighborhoods', async function(req, res) {
    const neighborhoods = await Neighborhoods.find();
    res.status(200).json(neighborhoods);
});

module.exports = routes;