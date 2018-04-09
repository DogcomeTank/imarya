
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

router.post('/userCartItems', (req, res)=>{
    if(!req.user){
        res.send('Please login.');
    }else{
        m.UserCart.find({'userId': req.user._id}).
        populate({
            path: 'productId',
            select: 'productName description img price',
        }).exec((err, doc)=>{
            res.json(doc);
        });
    }
});

router.post('/addOrSubtractCartItem', (req, res)=>{
    if(!req.user){
        res.send('Please login.');
    }else{
        m.ProductQty.findById

        res.json(req.body);
    }
});

router.post('/removeItemInShoppingCart', (req, res)=>{
    let a = req.body;
    m.UserCart.findById(a.a).remove().exec((err, doc)=>{
        let returnDoc = {};
        returnDoc.userCartId = a.a;
        returnDoc.status = doc.result.n;
        res.json(returnDoc);
    });

});




module.exports = router;