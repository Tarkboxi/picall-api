const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const jwtSecretKey = "ranomize_this_later_@_blah_flah";
const jwtDuration = "1h";


router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: "User Created",
            })
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            });
        })
    });
});

router.post("/login", (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if(!user) {
            return res.status(401).json({
                message: "Email not registered."
            });
        }
        return bcrypt.compare(req.body.password, user.password).then(result => {
            if(!result) {
                return res.status(401).json({
                    message: "Incorrect Password/email."
                });                 
            }
            const token = jwt.sign({email: user.email, userid: user._id}, jwtSecretKey, {expiresIn: jwtDuration});
            return res.status(200).json({
                token: token
            });
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Failed to verify auth and generate session.",
            error: err
        });
    });
});


module.exports = router;