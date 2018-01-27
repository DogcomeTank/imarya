//google login config
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../models/keys');
const googleUser = require('../models/userGoogle');

passport.serializeUser((gUser, done)=>{
  console.log('serialized: '+gUser.id);
  done(null, gUser.id);
});

passport.deserializeUser((id, done)=>{
  googleUser.findOne({'_id':id}).then((user)=>{
    console.log('find:' + user);
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
      if(gUser.id){
        console.log('gUser:' + gUser);
        return cb(err, gUser);
      }else{
        //Add new user to database
        var newGoogleUser = new googleUser({
          username: profile.displayName,
          googleId:profile.id,
          oAuthProvider: 'google',
          createdAt: { type: Date, default: Date.now }
    
        });
    
        newGoogleUser.save(function (err, newAddedGoogleUser) {
          if (err){
            return cb(null, err); 
          }
          console.log('new user save: '+ newAddedGoogleUser);
            return cb(err, newAddedGoogleUser); 
          
        })
      }
    });


  }
));