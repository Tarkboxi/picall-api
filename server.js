const app = require("./app");
const http = require("http");
const port = require('./port');
const options = {};
http.createServer(options, app).listen(port);