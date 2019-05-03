const express = require('express');
const router = express.Router();
const Products = require('../models/products/product');
const ProductInfo = require('../models/products/productInfo');



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

// router.get('/productInfo',(req, res)=>{
//     newInfo = {
//         productId: '5a792cd27db0582524720c65',
//         description:'testing',
//         price: '3.44',
//     }
    
//     const newProductInfo = new ProductInfo(newInfo);
//     newProductInfo.save((err,doc)=>{
//         if(err){
//             console.log(err);
//             return next(err);
//         }
//         res.send(doc);
//     });
// });

router.get('/deleteItem', (req, res) => {
    res.send('delete');
});

router.get('/updateItem', (req, res) => {

});



module.exports = router;