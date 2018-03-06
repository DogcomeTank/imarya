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
// get one product by ID
router.post('/getProductById', (req, res) => {
    m.Products.findById(req.body.productId, (err, item) => {
        if (err) return next(err);
        res.json(item);
    });

});
// display product Qty, size, color etc..
router.post('/showProductQty', (req, res) => {

    m.ProductQty.find({
        'productId': req.body.productId
    }).
    populate({
        path: 'locationId',
        select: 'location'
    }).
    exec(function (err, itemInfo) {
        if (err) return handleError(err);
        res.json(itemInfo);
    });;
});
// update product information
router.post('/updateProductInformation', (req, res) => {
    let formDataForUpdate = JSON.parse(req.body.myData);
    m.Products.findById(formDataForUpdate._id, function (err, updatedItem) {
        if (err) return handleError(err);
      
        updatedItem.set({ 
            ipn: formDataForUpdate.ipn,
            productName:  formDataForUpdate.productName,
            description: formDataForUpdate.description,
            by: formDataForUpdate.by,
            price: formDataForUpdate.price,
            img: formDataForUpdate.img
        });
        updatedItem.save(function (err, updatedupdatedItem) {
          if (err) return handleError(err);
          res.json(updatedupdatedItem);
        });
      });
    
});

router.get('/receiving', (req, res)=>{
    m.ProductQty.find({productId: req.body.productId}).
    populate({path:'productId', select:['productName', 'ipn']}).
    exec((err, receivedProductInfo)=>{
        if(err) console.log('router - receiving err: ' + err);

        res.json(receivedProductInfo);
    });
});



// productTable.ejs Add location list
router.get('/location',(req, res)=>{
    m.Location.find({}).sort('location').exec(
        (err, allLocation)=>{
            res.json(allLocation);
        }
    )
});
router.post('/location',(req, res)=>{
    var l = req.body.location;
    var newLocation = new m.Location({location: l});
    newLocation.save((err, doc)=>{
        res.json(doc);
    })
});

router.get('/category', (req, res)=>{
    m.Category.find({}, (err, catList)=>{
        res.json(catList);
    });
});

router.post('/category', (req, res)=>{
    var categoryFromForm = req.body.category;
    var newCategory = new m.Category({category: categoryFromForm});

    newCategory.save((err, doc)=>{
        res.json(doc);
    });
});


router.post('/addNewProduct', (req, res)=>{
    let newProduct = JSON.parse(req.body.newProductFormDataArray);
    const product = new m.Products(newProduct);
    product.save((err, doc) => {
        if (err) {
            console.log("err:  " + err);
            return next(err);
        }
        res.json(doc);
    });
});






module.exports = router;