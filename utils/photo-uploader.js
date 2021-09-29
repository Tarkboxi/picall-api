const util = require("util");
const multer = require("multer");
const MIME_TYPE_MAP = require("../properties/image-mime");
const imageFilter = require("./image-filter")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "store/photos");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});

var uploadFiles = multer({ storage: storage, fileFilter: imageFilter }).array("photos");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;