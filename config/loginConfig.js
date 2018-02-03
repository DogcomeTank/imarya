
const express = require('express');
const router = express.Router();
const keys = require('../models/keys');
const myUser = require('../models/user');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStractege = require('passport-google-oauth20').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

//define passport usage
passport.use(new LocalStrategy(
  function(username, password, done) {
    myUser.findOne({ username: username }, function (err, profile) {
      if (err) { return done(err); }
      if (!profile) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!profile.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
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
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(null, profile);
  });
}
));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.AppId,
    clientSecret: keys.facebook.AppSecrect,
    callbackURL: keys.facebook.AppCallbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

//define REST proxy options based on logged in user
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(null); }
  res.redirect('/error')
}




router.get('/', 
  function(req, res) {
    res.send('Hello World.');
  });


router.get('/google-login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


router.get('/google-token', passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res){
    res.send(req.user);
  });

router.get('/facebook-login', passport.authenticate('facebook',{
  scope:['public_profile', 'email']
}));


router.get('/facebook-token', passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res){
    res.send(req.user);
  });


router.get('/error', function(req, res){
  res.send('An error has occured.');
});

module.exports = router;



