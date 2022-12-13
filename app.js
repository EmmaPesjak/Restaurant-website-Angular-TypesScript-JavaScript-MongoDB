// Include all needed modules.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const neighborhoodRoutes = require('./routes/neighborhoods');
const restaurantRoutes = require('./routes/restaurants');

// Create an express application.
const app = express();
app.use(cors());
app.use(express.json()); 

// Define the port.
const port = process.env.PORT || 3000;

// Start the server.
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});

// Set up mongoose.
const DB_SERVER = process.env.DB_SERVER;
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(DB_SERVER, {useNewUrlParser: true});

// Check if the connection succeeded. 
const  dataSource = mongoose.connection;
dataSource.on("error", console.error.bind(console, "connection error: "));
dataSource.once("open", function () {
  console.log("Connected successfully");
});

// Use routes.
app.use('/', neighborhoodRoutes);
app.use('/', restaurantRoutes);
