const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
    new GoogleStrategy({
        //option for the google strat
        callbackURL:'',
        clientID:'',
        clientSecret:''
    },()=>{
        //passport callback function
    })
)