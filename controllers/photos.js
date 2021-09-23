const express = require("express");
const router = express.Router();
const Photos = require('../models/photos');
const checkAuth = require("../middleware/check-auth");
const photoUpload = require("../middleware/photo-uploader");
const deleter = require("../middleware/photo-deleter");
const _ = require("lodash");

router.post("", checkAuth, async(req, res, next)=> {
    await photoUpload(req, res);
    const url = req.protocol+'://'+req.get("host");
    const photos = new Photos({
        title: req.body.title,
        url: url + "/photos/" + req.file.filename,
        creator: req.userData.userId
    });
    photos.save().then(createdPhoto => {
        res.status(201).json({
            message: 'Photo added successfully',
            photos: [createdPhoto],
            total: 1
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

router.delete("", checkAuth, (req, res, next) => {
    Photos.deleteMany({_id: { $in: _.map(req.body, 'id')}, creator: req.userData.userId})
    .then(async result => {
        await deleter(_.map(req.body, 'url'), req.headers);
        res.status(200).json({ 
            message: "Photos deleted!",
            photos: req.body
        });
    });
});

module.exports = router;