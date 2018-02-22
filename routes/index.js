
const express = require('express');
const router = express.Router();
// const Products = require('../models/products/product');
const Products = require('../models/models');



router.get('/', (req, res) => {
    let userLoginInfo = false;
    if(req.user){
        userLoginInfo = req.user;
    }
    
    Products.find({}, (err, products) => {
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
