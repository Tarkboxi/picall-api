const path = require("path");
const _ = require("lodash");

module.exports =  (url) => {
    return _.replace(url, path.parse(url).dir, 'store/photos');    
}