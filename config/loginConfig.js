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
    res.redirect('/');
  });

router.get('/facebook-login', passport.authenticate('facebook', {
  scope: 'email, public_profile'
}));


router.get('/facebook-token', passport.authenticate('facebook', {
    failureRedirect: '/login/error'
  }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/editContactInfo', (req, res) => {
  if (req.user) {
    const userInfo = req.user;
    res.render('./users/userInfoEdit', {
      userInfo
    });
  }else{
    res.redirect('/');
  }

});
router.post('/editContactInfo', (req, res) => {
  if (req.user) {
    myUser.findByIdAndUpdate(req.user._id, {$set: req.body}, (err, userInfo) => {
      if (err) return handleError(err);
      res.render('./users/userInfoEdit', {
        userInfo
      });
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/error', function (req, res) {
  res.send('An error has occurred.');
});





module.exports = router;