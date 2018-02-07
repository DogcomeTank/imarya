const express = require('express');
const router = express.Router();
const Products = require('../models/productList');



router.get('/', (req, res) => {
    Products.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('home', {
            products
        });
    });

});



module.exports = router;