const DB_CONNECTION_STRING = require('./keys/db-key');
const path = require("path");
const photoRoutes = require("./controllers/photos");
const userRoutes = require("./controllers/users");
const express = require('express');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(DB_CONNECTION_STRING).then( () => {
}).catch(()=> {
    console.error("Failed to connect to Database!");
});

//app.use("/api/photos", photoRoutes);
app.use("/api/users", userRoutes);
app.use("/photos", express.static(path.join("store/photos")));

module.exports = app;