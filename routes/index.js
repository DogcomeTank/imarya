
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

router.get('/checkout', (req, res) => {
    if(!req.user){
        res.redirect('/');
    }

    let userLoginInfo = false;
    if(req.user){
        userLoginInfo = req.user;
    }

    m.Products.find({availability: 1}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('payment/checkout', {
            products,
            userLoginInfo,
        });
    });
});

router.get('/productDetail/id/:id', function (req, res) {
    let userLoginInfo = false;
    if(req.user){
        userLoginInfo = req.user;
    }
    m.Products.findById(req.params.id,(err, doc)=>{
        m.ProductQty.find({productId: req.params.id}, (err, pQty)=>{
            console.log(pQty);
            res.render('productDetail', {
                doc,
                pQty,
                userLoginInfo,
            });
        })
        
    });
  })




module.exports = router;
