

const express = require('express');
const router = express.Router();
const Students = require('../models/userLocal');
const passport = require('passport');

router.get('/login', (req,res)=>{
    res.render('login');
});

router.post('/login',passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/oAuth/login'
    }),(req,res)=>{
        res.redirect('/');
})

router.get('/signup', (req,res)=>{
    res.render('signup');
});

router.post('/signup',(req, res, next)=>{
    
    User.register(new User({username:req.body.username}), req.body.password, (err, student)=>{
        if(err){
            return next(err);
        }
        
        passport.authenticate('local')( req, res, ()=>{
            res.redirect('/');
        });
    });
    
});

module.exports = router;