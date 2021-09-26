const jwt = require("jsonwebtoken");
const jwtParams = require("../keys/jwt-secret-key")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, jwtParams.key);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch(error) {
        res.status(401).json({ message: error});
    }
};