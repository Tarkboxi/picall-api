const jwt = require("jsonwebtoken");
const jwtParams = require("../keys/jwt-secret-key")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, jwtParams.key);
    next();
    } catch(error) {
        res.status(401).json({ message: "Auth failed!"});
    }
};