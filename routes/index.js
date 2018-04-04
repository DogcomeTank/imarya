
const express = require('express');
const router = express.Router();
const m = require('../models/models');



router.get('/', (req, res) => {
    let userLoginInfo = false;
    if(req.user){
        userLoginInfo = req.user;
    }

    m.Products.find({availability: 1}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('index', {
            products,
            userLoginInfo,
        });
    });

});



module.exports = router;
