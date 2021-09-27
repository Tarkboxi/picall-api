const app = require("./app");
const http = require("http");
const port = process.env.port;
const options = {};
http.createServer(options, app).listen(port);