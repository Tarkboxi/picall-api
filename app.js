const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const photoRoutes = require("./controllers/photos");
const userRoutes = require("./controllers/users");

const app = express();
module.exports = app;