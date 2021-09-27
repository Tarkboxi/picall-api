const mongoose = require("mongoose");

const photoSchema = mongoose.Schema(
    {   
        title: {type: String},
        url: {type: String, required: true},
        type: { type: String, default: "photos" },
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    }, 
    { timestamps: true });

module.exports = mongoose.model("Photos", photoSchema);