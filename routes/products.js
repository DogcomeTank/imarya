

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


module.exports = router;