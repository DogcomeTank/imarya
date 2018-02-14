const express = require('express');
const router = express.Router();
const Category = require('../models/products/category');
const Location = require('../models/products/location')
const Products = require('../models/products/product');
const ProductCategory = require('../models/products/productCategory');
const ProductHistory = require('../models/products/productHistory');
const ProductInfo = require('../models/products/productInfo');
const ProductQty = require('../models/products/productQty');



router.get('/', (req, res) => {
    Products.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('./products/productManagement', {
            products
        });
    });

});

router.get('/joins', (req, res) => {
    Products.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('./products/products', {
            products
        });
    });

});

router.post('/addItem', (req, res) => {
    const product = new Products(req.body);
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
    
    const newProductInfo = new ProductQty(newInfo);
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