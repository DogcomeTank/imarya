
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
    populate({ path: 'productId', select: 'productName' }).
    exec(function (err, story) {
      if (err) return handleError(err);
      console.log(story);
      // prints "The author is Ian Fleming"
    });

});

router.get('/addC',(req,res)=>{
    let i = null;
    m.Products.findOne({productName: 'agw'}, (err, doc)=>{
        i = doc._id;
        const pc = new m.ProductCategory({
            productId: i,
        });
    
        pc.save();
    });

    





    res.render('./test');
});

router.post('/addC', (req, res)=>{
    const n = new Products(req.body);
    n.save((err, doc)=>{
        if(err) {console.log(err)};

        res.send(doc);
    });


});


module.exports = router;