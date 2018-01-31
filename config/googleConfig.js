//google login config
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../models/keys');
const googleUser = require('../models/userGoogle');

passport.serializeUser((gUser, done)=>{
  done(null, gUser.id);
});

passport.deserializeUser((id, done)=>{
  googleUser.findOne({'_id':id}).then((user)=>{
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
  },
  function (accessToken, refreshToken, profile, cb) {
    googleUser.findOne({'googleId':profile.id}, (err, gUser)=>{
      if(gUser != null){
        
        return cb(err, gUser);
      }else{
        //Add new user to database
        var newGoogleUser = new googleUser({
          username: profile.displayName,
          googleId:profile.id,
          email: profile.emails[0].value,
          oAuthProvider: 'google',
          accessLevel:0,
    
        });
    
        newGoogleUser.save(function (err, gUser) {
          if (err){
            console.log(err);
            return cb(null, err); 
          }
            return cb(err, gUser); 
          
        })
      }
    });


  }
));