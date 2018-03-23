const express = require('express');
const router = express.Router();
const m = require('../models/models');
const path = require('path');
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');





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
            // m.ProductQty.find({productId: p._id}).distinct('color size').exec(
            //     (err, pQty) => {
            //         if (err) return next(err);
            //         console.log(pQty);
            //         let fullProductInfo = {};
    
            //         fullProductInfo['productInfo'] = p;
            //         fullProductInfo['productQty'] = pQty;
            //         res.send(JSON.stringify(fullProductInfo));
            //     }
            // );

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

// product Info modal size and color on change
router.post('/colorSizeOnChange', (req, res) => {
    
    let dataToFind = req.body;
    dataToFind = JSON.parse(dataToFind.selectedData);
    m.ProductQty.find(dataToFind.findData).select([dataToFind.selection,'qty']).sort([
        [dataToFind.selection, 1]
    ]).exec(
        (err, doc) => {
            res.json(doc);
        }
    );
});

router.post('/qtyUpdate', (req, res) => {
    let qtyToUpdate = JSON.parse((req.body.jsonQtyToUpdateArry));
    m.ProductQty.findById(qtyToUpdate.pQtyId, 'qty', (err, doc) => {
        const qtyInStock = doc.qty;
        let totalQty = qtyInStock + Number(qtyToUpdate.qtyToUpdate);

        if (totalQty < 0) {
            totalQty = 0;
        }

        m.ProductQty.findByIdAndUpdate(qtyToUpdate.pQtyId, {
            'qty': totalQty
        }, {
            new: true
        }, (err, newQty) => {
            res.json(newQty);
        });

    });
});


// update product information
router.post('/updateProductInformation', (req, res) => {
    let formDataForUpdate = JSON.parse(req.body.myData);
    m.Products.findById(formDataForUpdate._id, function (err, updatedItem) {
        if (err) return handleError(err);

        updatedItem.set({
            ipn: formDataForUpdate.ipn,
            productName: formDataForUpdate.productName,
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

router.get('/imgUpload', (req, res) => {

    res.render('products/imgUpload');
});

router.post('/imgUpload', (req, res) => {

    uploadImage(req, res);



});

router.get('/receiving', (req, res) => {
    m.ProductQty.find({
        productId: req.body.productId
    }).
    populate({
        path: 'productId',
        select: ['productName', 'ipn']
    }).
    exec((err, receivedProductInfo) => {
        if (err) console.log('router - receiving err: ' + err);

        res.json(receivedProductInfo);
    });
});

router.post('/newLocationQty', (req, res) => {
    let newLocationQty = JSON.parse(req.body.jsonNewLocationQty);

    m.Products.findOne({
        'ipn': newLocationQty.ipn
    }, 'ipn', (err, productId) => {

        newLocationQty.productId = productId._id;

        let mLocationQty = new m.ProductQty(newLocationQty);
        mLocationQty.save((err, newSaveLocationQty) => {
            res.json(newSaveLocationQty);
        });
    });


});



// productTable.ejs Add location list
router.get('/location', (req, res) => {
    m.Location.find({}).sort('location').exec(
        (err, allLocation) => {
            res.json(allLocation);
        }
    )
});
router.post('/location', (req, res) => {
    var newLoc = req.body.location;
    var newLocation = new m.Location({
        location: newLoc
    });
    newLocation.save((err, doc) => {
        res.json(doc);
    })
});

router.get('/category', (req, res) => {
    m.Category.find({}, (err, catList) => {
        res.json(catList);
    });
});

router.post('/category', (req, res) => {
    var categoryFromForm = req.body.category;
    var newCategory = new m.Category({
        category: categoryFromForm
    });

    newCategory.save((err, doc) => {
        res.json(doc);
    });
});


router.get('/addNewProduct', (req, res) => {

    m.Category.find({}, (err, pCateg) => {
        let doc = false;
        res.render('products/addNewProduct', {
            doc,
            pCateg
        });
    })
});

router.post('/addNewProduct', (req, res) => {
    var form = new formidable.IncomingForm();
    let theImgName = '';
    form.uploadDir = "./public/img/";
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.multiples = false;
    /* this is where the renaming happens */
    form.on('fileBegin', function (name, file) {
        theImgName = Date.now() + '_' + file.name;
        //rename the incoming file to the file's name
        file.path = form.uploadDir + "/" + theImgName;
    })

    form.parse(req, function (err, fields, files) {
        // ...
        fields.img = theImgName;
        insertToProducts(theImgName, fields);
    });

    function insertToProducts(pinfo, fieldsInfo) {

        const product = new m.Products(fieldsInfo);
        product.save((err, doc) => {
            if (err) throw err;

            let subString = 'category';
            for (let key in fieldsInfo) {
                if (key.indexOf(subString) !== -1) {
                    let productCate = new m.ProductCategory({
                        productId: doc._id,
                        categoryId: fieldsInfo[key]
                    });
                    productCate.save();
                }
            }
            m.Category.find({}, (err, pCateg) => {
                res.render('products/addNewProduct', {
                    doc,
                    pCateg
                });
            });
        });
    }
});





module.exports = router;