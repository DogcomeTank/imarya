//routes

const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//auth logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//auth with Google
router.get('/google',passport.authenticate('google',{
    scope:['profile']
}));

//auth with Google call back
router.get('/google/redirect',passport.authenticate('google'), (req,res)=>{
    if(req.isAuthenticated){
        res.send(req.user);
    }else{
        res.send('none');
    }
});

module.exports = router;