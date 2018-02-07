const express = require('express');
const router = express.Router();
const Products = require('../models/productList');



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
router.get('/addItem', (req, res) => {
    res.send('addItem');
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

router.get('/deleteItem', (req, res) => {
    res.send('delete');
});

router.get('/updateItem', (req, res) => {

});

// router.post('/productEdit', (req, res) => {
//     var data = req.body;

//     if (data.action == 'addItem') {
//         let dataJson = JSON.stringify(data.info);
//         console.log(data.info);
//         const product = new Products(data.info);
//         product.save((err, doc) => {
//             if (err) {
//                 console.log("err: " + err);
//                 return next(err);
//             } else {
//                 req.body = "New item added";
//             }
//         });

//     } else if (data.action == 'deleteProduct') {
//         Products.remove({
//             _id: data.id
//         }, (err, msg) => {
//             if (err) {
//                 return next(err);
//             } else {
//                 console.log(msg);
//             }
//         })
//     } else if (data.action == 'updateItem') {
//         console.log(action);
//     }

//     res.send(req.body);
// });




module.exports = router;