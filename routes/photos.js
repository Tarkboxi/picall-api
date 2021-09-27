const express = require("express");
const router = express.Router();
const PhotoController = require("../controllers/photos");
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, PhotoController.addPhotos);
router.get("", checkAuth, PhotoController.getPhotos);
router.delete("", checkAuth, PhotoController.deletePhotos);

module.exports = router;