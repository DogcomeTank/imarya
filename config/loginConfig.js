const express = require('express');
const router = express.Router();
const keys = require('../models/keys');
const myUser = require('../models/user');
const utils = require('./utils');
const passport = require('passport'),
  RememberMeStrategy = require('passport-remember-me').Strategy,
  LocalStrategy = require('passport-local').Strategy,
  GoogleStractege = require('passport-google-oauth20').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;
const m = require('../models/models');
const userInfo = require('../models/user');

//define passport usage
passport.use(new RememberMeStrategy(
  function (token, done) {
    //Find Token cookies
    m.Token.find(token, (err, tempCookies) => {
      if (err) {
        return done(err);
      }
      if (!tempCookies) {
        return done(null, false);
      }
      // find user info if tempCookies
      userInfo.findById(tempCookies[0].userId, (err, user) => {
        return done(null, user);
      })

    });
  },
  function (user, done) {
    //issue new Remember me Token cookies
    let tokenRandom = utils.randomString(64);
    let token = new m.Token({
      token: tokenRandom,
      userId: user.id,
      displayName: 'scott',
    });
    token.save((err, doc) => {
      if (err) return err;
      return done(null, doc);
    });
  }

));

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
    myUser.findOne({
      oAuthId: profile.id,
      oAuthProvider: 'google',
    }, function (err, user) {
      if (!user) {
        const newUserForInsert = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          oAuthId: profile.id,
          oAuthProvider: profile.provider,
        };
        myUser.create(newUserForInsert, (err, newInserted) => {
          return cb(err, newInserted);
        });

      } else {
        return cb(err, user);
      }
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.AppId,
    clientSecret: keys.facebook.AppSecrect,
    callbackURL: keys.facebook.AppCallbackURL
  },
  function (accessToken, refreshToken, profile, cb) {
    myUser.findOne({
      oAuthId: profile.id,
      oAuthProvider: 'facebook',
    }, function (err, user) {
      if (!user) {
        let userEmail = null;
        if (profile.email) {
          userEmail = profile.email;
        }
        const newUserForInsert = {
          displayName: profile.displayName,
          email: userEmail,
          oAuthId: profile.id,
          oAuthProvider: profile.provider,
        };

        myUser.create(newUserForInsert, (err, newInserted) => {
          return cb(err, newInserted);
        });


      } else {
        return cb(err, user);
      }

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





router.get('/',
  function (req, res) {
    if (req.user) {
      let su = req.user;
      if (typeof (req.user) === 'object') {
        su = req.user[0];
      }
      res.send('req.user:' + JSON.stringify(su.displayName));
    } else {
      res.send('not login');
    }
  });

router.get('/google-login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


router.get('/google-token', passport.authenticate('google', {
    failureRedirect: '/login/error'
  }),
  function (req, res) {
    // remember me
    let tokenRandom = utils.randomString(64);
    let token = new m.Token({
      token: tokenRandom,
      userId: req.user._id,
      displayName: req.user.displayName,
    });
    token.save((err, doc) => {
      if (err) return err;
      res.cookie('remember_me', doc, {
        path: '/',
        httpOnly: true,
        maxAge: 604800000
      }); // 7 days
      res.redirect('/');
    });
    // remember me
  });

router.get('/facebook-login', passport.authenticate('facebook', {
  scope: 'email, public_profile'
}));


router.get('/facebook-token', passport.authenticate('facebook', {
    failureRedirect: '/login/error'
  }),
  function (req, res) {
    // remember me
    let tokenRandom = utils.randomString(64);
    let token = new m.Token({
      token: tokenRandom,
      userId: req.user._id,
      displayName: req.user.displayName,
    });
    token.save((err, doc) => {
      if (err) return err;
      res.cookie('remember_me', doc, {
        path: '/',
        httpOnly: true,
        maxAge: 604800000
      }); // 7 days
      res.redirect('/');
    });
    // remember me
  });

router.get('/editContactInfo', (req, res) => {
  if (req.user) {
    const userInfo = req.user;
    myUser.findById(req.user._id, (err, userInfo)=>{
      res.render('./users/userInfoEdit', {
        userInfo
      });
    });
    
  } else {
    res.redirect('/');
  }

});
router.post('/editContactInfo', (req, res) => {
  if (req.body) {
    myUser.findByIdAndUpdate(req.user._id, {
      $set: req.body
    }, (err, userInfo) => {
      if (err) console.log(err);
      res.redirect('/');
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('remember_me');
  req.logout();
  res.redirect('/');
});

router.get('/error', function (req, res) {
  res.send('An error has occurred.');
});





module.exports = router;