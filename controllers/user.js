const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtParams = require("../keys/jwt-secret-key");
const bcryptSalt = 10;
const messaging = require("../properties/messaging");
const errorBuilder = require('../utils/error-builder');

exports.addUser = (req, res, next) => {
    bcrypt.hash(req.body.password, bcryptSalt).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
               data: result,
            })
        })
        .catch(error=> {
            res.status(500).json({
                errors: [ errorBuilder("500", messaging.userExists+req.body.email, error) ]
            });
        })
    });
};

exports.login = (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if(!user) {
            return res.status(401).json({
                errors: [ errorBuilder("401", messaging.unregisteredEmail, {}) ]
            });
        }
        return bcrypt.compare(req.body.password, user.password).then(result => {
            if(!result) {
                return res.status(401).json({
                    errors: [ errorBuilder("401", messaging.incorrectCredentials, {}) ]
                });                 
            }
            const token = jwt.sign({email: user.email, userId: user._id}, jwtParams.key, {expiresIn: jwtParams.expires});
            return res.status(200).json({
                data: {
                    token: token
                },
            });
        });
    }).catch(error => {
        return res.status(401).json({
            errors: [ errorBuilder("401", messaging.sessionGenerateFailed, error) ]
        });
    });
};