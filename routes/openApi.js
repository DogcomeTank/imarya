const express = require('express');
const router = express.Router();
const m = require('../models/models');
const path = require('path');


// user add to cart function
router.get('/',(req, res)=>{
    res.send('good');
});
router.post('/addToCart', (req,res)=>{
    var addToCartItem = new m.UserOrder(req.body);
    m.UserOrder.save((err, doc)=>{
        console.log(doc);
    });
});




module.exports = router;