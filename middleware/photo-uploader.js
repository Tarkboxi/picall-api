const util = require("util");
const multer = require("multer");
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

var uploadFiles = multer({ storage: storage }).single("photo");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;