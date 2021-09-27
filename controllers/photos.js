const Photos = require('../models/Photos');
const photoUpload = require("../utils/photo-uploader");
const deleter = require("../utils/photo-deleter");
const _ = require("lodash");
const messaging = require("../properties/messaging");
const errorBuilder = require('../utils/error-builder');

exports.addPhotos = async(req, res, next)=> {
    let uploadResults = await photoUpload(req, res).then(()=>{
        const url = req.protocol+'://'+req.get("host");
        const photos = new Photos({
            title: req.body.title,
            url: url + "/photos/" + req.file.filename,
            creator: req.userData.userId
        });
        photos.save().then(createdPhoto => {
            res.status(201).json({
                data: [createdPhoto],
            });
        });
    }).catch((error) => {
        res.status(500).json({
            errors: [ errorBuilder("500", error.message, error) ]
        });
    });
};

exports.getPhotos = (req, res, next) => {
    const countPerPage = +req.query.count;
    const currentPage = +req.query.page;
    const photoQuery = Photos.find();
    let fetchedPhotos;
    photoQuery.sort({ createdAt: 'desc'});
    if (countPerPage && currentPage) {
        photoQuery.skip(countPerPage * (currentPage - 1)).limit(countPerPage);
    }
    photoQuery.then(documents => {
        fetchedPhotos = documents;
        return Photos.count();
    }).then(count => {
        res.status(200).json({
            data: fetchedPhotos,
            total: count
        });
    })
    .catch(error=> {
        res.status(500).json({ 
            errors: [ errorBuilder("500", messaging.photoFetchFailed, error) ]
        });
    });
};

exports.deletePhotos = (req, res, next) => {
    Photos.deleteMany({_id: { $in: _.map(req.body, 'id')}, creator: req.userData.userId})
    .then(async result => {
        if(result.deletedCount > 0) {
            await deleter(_.map(req.body, 'url'), req.headers);
            res.status(200).json({ 
                data: req.body,
                count: result.deletedCount
            });
        } else {
            res.status(500).json({ 
                errors: [ errorBuilder("500", messaging.photoDeleteFailed, error) ],
            });
        }
    })
    .catch(error=> {
        res.status(500).json({ 
            errors: [ errorBuilder("500", error.message, error) ]
        });
    });
};