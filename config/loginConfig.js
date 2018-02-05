const express = require('express');
const router = express.Router();
const keys = require('../models/keys');
const myUser = require('../models/user');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  GoogleStractege = require('passport-google-oauth20').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

//define passport usage
passport.use(new LocalStrategy(
  function (username, password, done) {
    myUser.findOne({
      username: username
    }, function (err, profile) {
      if (err) {
        return done(err);
      }
      if (!profile) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!profile.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStractege({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
  },
  function (accessToken, refreshToken, profile, cb) {
    myUser.findOrCreate({
      oAuthId: profile.id,
      oAuthProvider: 'google',
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.AppId,
    clientSecret: keys.facebook.AppSecrect,
    callbackURL: keys.facebook.AppCallbackURL
  },
  function (accessToken, refreshToken, profile, cb) {
    myUser.findOrCreate({
      oAuthId: profile.id,
      oAuthProvider: 'facebook',
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

//define REST proxy options based on logged in user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null);
  }
  res.redirect('/error')
}




router.get('/',
  function (req, res) {
    res.send('Hello World.');
  });

router.get('/google-login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


router.get('/google-token', passport.authenticate('google', {
    failureRedirect: '/error'
  }),
  function (req, res) {

    res.json(JSON.stringify(req.user));
  });

router.get('/facebook-login', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));


router.get('/facebook-token', passport.authenticate('facebook', {
    failureRedirect: '/error'
  }),
  function (req, res) {
    res.send(JSON.stringify(req.user));
  });


router.get('/error', function (req, res) {
  res.send('An error has occured.');
});


module.exports = router;