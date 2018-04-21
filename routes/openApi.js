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
        // req.body.val is UserCart._id req.body.action: a, s 
        let returnData = {};
        // find productQty from userCart
        m.UserCart.findById(req.body.val, (err, userCartInfo) => {
            // if productQty not available, delete item from userCart
            if (userCartInfo) {
                m.ProductQty.findById(userCartInfo.productQtyId, (err, productQtyInfo) => {
                    if (!productQtyInfo || productQtyInfo.qty <= 0) {
                        // if product not available
                        m.UserCart.findById(req.body.val).remove().exec();
                        returnData.available = false;
                        res.json(returnData);
                    } else if (productQtyInfo.qty > 0 && productQtyInfo.qty < userCartInfo.qty) {
                        // if product available but not enough
                        returnData.notEnough = true
                        returnData.available = true;
                        returnData.qtyInStock = productQtyInfo.qty;
                        res.json(returnData);

                    } else if (productQtyInfo.qty > 0 && productQtyInfo.qty >= userCartInfo.qty) {
                        // if product available and has enough in stock
                        returnData.notEnough = false;
                        returnData.available = true;
                        returnData.qtyInStock = productQtyInfo.qty;
                        // Add item from shopping cart
                        if (req.body.action == 'a') {
                            if (productQtyInfo.qty == userCartInfo.qty) {
                                // if max qty 
                                returnData.maxQty = true;
                                res.json(returnData);
                            } else {
                                let newUserCartQty = userCartInfo.qty + 1;
                                m.UserCart.findOneAndUpdate({
                                    _id: req.body.val
                                }, {
                                    $set: {
                                        qty: newUserCartQty
                                    }
                                }, {
                                    new: true
                                }, (err, doc) => {
                                    returnData.newQty = doc.qty;
                                    res.json(returnData);
                                });
                            }
                        } else if (req.body.action == 's') {
                            // Subtract item from shopping cart
                            let newUserCartQty = userCartInfo.qty - 1;
                            if (userCartInfo.qty <= 1) {
                                // remove document
                                m.UserCart.findById(req.body.val).remove().exec((err, doc) => {
                                    if (err) {
                                        returnData.err = true;
                                        res.json(returnData);
                                    } else {
                                        returnData.remove = true;
                                        res.json(returnData);
                                    }
                                });

                            } else {
                                m.UserCart.findOneAndUpdate({
                                    _id: req.body.val
                                }, {
                                    $set: {
                                        qty: newUserCartQty
                                    }
                                }, {
                                    new: true
                                }, (err, doc) => {
                                    returnData.newQty = doc.qty;
                                    res.json(returnData);
                                });
                            }
                        }

                    }
                });
            }else{
                res.json(false);
            }
        });
    }
});

router.post('/getTotalInCart', (req, res)=>{
    let total = 0;
    if(req.user){
        m.UserCart.find({userId: req.user._id}, 'productId qty').populate({path:'productId', select: 'price'}).exec((err, doc)=>{
            if(doc.length){
                for( let i = 0; i < doc.length; i++){
                    total = doc[i].qty * doc[i].productId.price + total;
                }
                res.json(total);
            }else{
                res.json(total);
            }
        });
    }else{
        res.json(total);
    }
});

router.post('/removeItemInShoppingCart', (req, res) => {
    let a = req.body;
    console.log(a);
    m.UserCart.findById(a.a).remove().exec((err, doc) => {
        let returnDoc = {};
        returnDoc.userCartId = a.a;
        returnDoc.status = doc.result.n;
        res.json(returnDoc);
    });

});

router.get('/checkout', (req, res)=>{
    res.render('payment/checkout.ejs');
})




module.exports = router;