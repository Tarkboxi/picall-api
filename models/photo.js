const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
    title: {type: String},
    url: {type: String, required: true}
});

module.exports = mongoose.model("Photo", photoSchema);