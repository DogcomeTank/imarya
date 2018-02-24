const express = require('express');
const router = express.Router();

const m = require('../models/models');

router.get('/', (req, res) => {
    m.Products.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('./products/productManagement', {
            products
        });
    });

});

router.get('/joins', (req, res) => {
    m.Products.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('./products/products', {
            products
        });
    });
});

router.post('/addItem', (req, res) => {
    const product = new m.Products(req.body);
    product.save((err, doc) => {
        if (err) {
            console.log("err: " + err);
            return next(err);
        } 
        res.send(doc._id);
    });
});

router.get('/t',(req, res)=>{
    newInfo = {
        productId:'5a792d26d24e4315f8f9ee59',
        locationId: '5a7a57939e85762ec8553937',
        qty: 4,
    }
    
    const newProductInfo = new m.ProductQty(newInfo);
    newProductInfo.save((err,doc)=>{
        if(err){
            console.log(err);
            return next(err);
        }
        res.send(doc);
    });
});

router.get('/deleteItem', (req, res) => {
    res.send('delete');
});

router.get('/updateItem', (req, res) => {

});



module.exports = router;