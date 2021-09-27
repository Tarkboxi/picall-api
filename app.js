const DB_CONNECTION_STRING = require('./keys/db-key');
const path = require("path");
const photoRoutes = require("./routes/photos");
const userRoutes = require("./routes/users");
const express = require('express');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(DB_CONNECTION_STRING).then( () => {
}).catch((error)=> {
    console.error(error);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, FETCH, DELETE, OPTIONS");
    next();
});

app.use("/api/photos", photoRoutes);
app.use("/api/users", userRoutes);
app.use("/photos", express.static(path.join("store/photos")));
app.use('/', express.static(__dirname + '/'));

module.exports = app;