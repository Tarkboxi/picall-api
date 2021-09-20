const express = require("express");
const multer = require("multer");
const router = express.Router();
const Photos = require('../models/photos');
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

router.post("", checkAuth, multer({storage: storage}).single("photo"), (req, res, next)=> {
    const url = req.protocol+'://'+req.get("host");
    const photo = new Photos({
        title: req.body.title,
        url: url + "/photos/" + req.file.filename
    });
    photos.save().then(createdPhoto => {
        res.status(201).json({
            message: 'Photo added successfully',
            photos: {
                id: createdPhoto._id,
                title: createdPhoto.title,
                url: createdPhoto.url
            }
        });
    });
});

router.get("", checkAuth, (req, res, next) => {
    const countPerPage = +req.query.count;
    const currentPage = +req.query.page;
    const photoQuery = Photos.find();
    let fetchedPhotos;
    if (countPerPage && currentPage) {
        photoQuery.skip(countPerPage * (currentPage - 1)).limit(countPerPage);
    }
    photoQuery.then(documents => {
        fetchedPhotos = documents;
        return Photos.count();
      }).then(count => {
        res.status(200).json({
          message: "Photos fetched successfully!",
          photos: fetchedPhotos,
          total: count
        });
      });
  });

module.exports = router;