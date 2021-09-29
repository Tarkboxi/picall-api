const MIME_TYPE_MAP = require("../properties/image-mime");
const imageFilter = function(req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if(isValid) {
        return cb(null, true);
    }
    return cb(null, false);
};
module.exports = imageFilter;