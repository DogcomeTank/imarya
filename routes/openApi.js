
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
    if(!req.user){
        res.send('Please login.');
    }else{
        let objConvertFormData = JSON.parse(req.body.convertFormData);
        objConvertFormData.userId = req.user._id;
        let addToCartItem = new m.UserCart(objConvertFormData);
        addToCartItem.save((err, doc)=>{
            res.json(doc);
        });
    }
    
});




module.exports = router;