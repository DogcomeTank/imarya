const express = require('express');
const router = express.Router();
const m = require('../models/models');



router.get('/', (req, res) => {
    let login = {
        "login": false
    };
    if (req.user) {
        login = {
            "login": true,
            "displayName": req.user.displayName,
        };
    }
    res.send(JSON.stringify(login));
});

router.get('/getProduct', (req, res) => {

    m.ProductCategory.find({}).
    populate({
        path: 'productId',
        select: 'productName'
    }).
    exec(function (err, story) {
        if (err) return handleError(err);
        console.log(story);
        // prints "The author is Ian Fleming"
    });

});

router.post('/addToCartModal', (req, res) => {
    m.Products.findById(req.body.id, (err, p) => {
        if (err) {
            return next(err);
        } else {
            m.ProductQty.find({
                productId: p._id
            }, (err, pQty) => {
                if (err) return next(err);

                let fullProductInfo = {};

                fullProductInfo['productInfo'] = p;
                fullProductInfo['productQty'] = pQty;
                res.send(JSON.stringify(fullProductInfo));
            });
        }

    });
});


// For product management
// display all product in dataTables, need login
router.get('/allProducts', (req, res) => {
    m.Products.find({}, (err, p) => {
        if (err) return next(err);
        let data = {
            'data': p
        };
        res.json(data);
    });

});
// display product Qty, size, color etc..
router.post('/showProductQty', (req, res) => {

    m.ProductQty.find({'productId': req.body.productId}, (err, p) => {
        if (err) return next(err);
        res.json(p);
    });
});




router.get('/addC', (req, res) => {
    let i = null;
    m.Products.findOne({
        productName: 'agw'
    }, (err, doc) => {
        i = doc._id;
        const pc = new m.ProductCategory({
            productId: i,
        });

        pc.save();
    });

    res.render('./test');
});

router.post('/addC', (req, res) => {
    const n = new Products(req.body);
    n.save((err, doc) => {
        if (err) {
            console.log(err)
        };

        res.send(doc);
    });


});


module.exports = router;