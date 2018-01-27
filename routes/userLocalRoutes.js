//routes
const express = require('express');
const router = express.Router();
const User = require('../models/userLocal');
const passport = require('passport');

// const localStrategy = require('passport-local').Strategy;

// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log('check user if exsit');
    res.send(req.body);
  });

// router.post('/login', passport.authenticate('local', {
//     // successRedirect:'/',
//     failureRedirect: './login'
// }), (req, res) => {
//     res.json('./callback', res.body);
// })

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', (req, res, next) => {

    //register a new user
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, userInfo) => {
        if (err) {
            res.json(err);
            return next(err);
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/loginStatu');
        });
    });

});



module.exports = router;