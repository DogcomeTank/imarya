
const express = require('express');
const router = express.Router();
const m = require('../models/models');
const path = require('path');
// for customer use

// user add to cart function
router.get('/addToCart',(req, res)=>{
    res.send('good');
});
router.post('/addToCart', (req,res)=>{

    let objConvertFormData = JSON.parse(req.body.convertFormData);
    objConvertFormData.userId = '5a8bb3659623dd33ac0b52a2';
    let addToCartItem = new m.UserOrder(objConvertFormData);
    addToCartItem.save((err, doc)=>{
        res.json(doc);
    });
});




module.exports = router;