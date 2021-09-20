const express = require("express");
const multer = require("multer");
const router = express.Router();
const Photo = require('../models/photo');
const checkAuth = require("../middleware/check-auth");
const MIME_TYPE_MAP = require("../properties/image-mime");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        callback(null, "store/photos");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name+'-'+Date.now()+'.'+ext);
    }
});

router.post("", multer({storage: storage}).single("photo"), (req, res, next)=> {
    const url = req.protocol+'://'+req.get("host");
    const photo = new Photo({
        title: req.body.title,
        url: url + "/photos/" + req.file.filename
    });
    photo.save().then(createdPhoto => {
        res.status(201).json({
            message: 'Photo added successfully',
            photo: {
                id: createdPhoto._id,
                title: createdPhoto.title,
                url: createdPhoto.url
            }
        });
    });
});

module.exports = router;