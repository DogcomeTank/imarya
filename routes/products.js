

// route for /products
const express = require('express');
const router = express.Router();
const m = require('../models/models');



router.get('/', (req, res) => {

        res.render('./products/productTable.ejs');

});


router.get('/receiving', (req, res)=>{
    res.render('./products/receiving.ejs');
});



// router.post('/addItem', (req, res) => {
//     const product = new m.Products(req.body);
//     product.save((err, doc) => {
//         if (err) {
//             console.log("err: " + err);
//             return next(err);
//         }
//         res.send(doc._id);
//     });
// });

// router.get('/joins', (req, res) => {
//     m.Products.find({}, (err, products) => {
//         if (err) {
//             return next(err);
//         }
//         res.render('./products/products', {
//             products
//         });
//     });
// });


module.exports = router;