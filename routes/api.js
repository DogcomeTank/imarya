const express = require('express');
const router = express.Router();
// const Products = require('../models/products/product');



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


module.exports = router;