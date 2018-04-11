const express = require('express');
const router = express.Router();
const m = require('../models/models');
const path = require('path');
// for customer use

// user add to cart function
router.get('/addToCart', (req, res) => {
    res.send('good');
});
router.post('/addToCart', (req, res) => {

    if (!req.user) {
        res.send('Please login.');

    } else {
        let objConvertFormData = JSON.parse(req.body.convertFormData);
        objConvertFormData.userId = req.user._id;
        let addToCartItem = new m.UserCart(objConvertFormData);
        addToCartItem.save((err, doc) => {
            res.json(doc);
        });
    }

});

router.post('/userCartItems', (req, res) => {
    if (!req.user) {
        res.send('Please login.');
    } else {
        m.UserCart.find({
            'userId': req.user._id
        }).
        populate({
            path: 'productId',
            select: 'productName description img price',
        }).exec((err, doc) => {
            res.json(doc);
        });
    }
});

router.post('/addOrSubtractCartItem', (req, res) => {
    if (!req.user) {
        res.send('Please login.');
    } else {
        let returnData = {};
        // find productQty from userCart
        m.UserCart.findById(req.body.val, (err, docUserCart) => {
            // if cannot find it in database
            if (!docUserCart) {
                returnData.result = 0;
                res.json(
                    // if not found, shopping cart item should be removed.
                    returnData
                );
            } else {
                // delete userCart item 
                if(req.body.action == 's' && docUserCart.qty == '1'){
                    m.UserCart.findById(req.body.val).remove().exec();
                    returnData.result = 0;
                    res.json(
                        // if not found, shopping cart item should be removed.
                        returnData
                    );
                }else{
                    
                    m.ProductQty.findById(docUserCart.productQtyId, (err, pQtyInfo)=>{
                        console.log(pQtyInfo);
                    });
    
                    //compare qty to docUserCart.qty
    
                    // if qty < docUserCart.qty, update userCartQty and return qty
    
                    // if qty >= docUserCart.qty, return new qty
                    console.log(docUserCart.qty)
                }

                //if userCart item found, get the info from productQty and return the qty

            }
        });
        
    }
});

router.post('/removeItemInShoppingCart', (req, res) => {
    let a = req.body;
    m.UserCart.findById(a.a).remove().exec((err, doc) => {
        let returnDoc = {};
        returnDoc.userCartId = a.a;
        returnDoc.status = doc.result.n;
        res.json(returnDoc);
    });

});




module.exports = router;