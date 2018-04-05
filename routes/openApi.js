const express = require('express');
const router = express.Router();
const m = require('../models/models');
const path = require('path');


// user add to cart function
router.get('/addToCart',(req, res)=>{
    res.send('good');
});
router.post('/addToCart', (req,res)=>{
    console.log(req.body);
    var addToCartItem = new m.UserOrder(req.body.convertFormData);
    addToCartItem.save((err, doc)=>{
        console.log(doc);
        res.json(doc);
    });
});




module.exports = router;