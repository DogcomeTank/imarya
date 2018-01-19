const express = require('express');
const router = express.Router();
const Students = require('../models/students');

router.get('/', (req, res) => {
    console.log(req.user);
    Students.find({}, (err, students) => {
        if (err) {
            return next(err);
        }
        console.log(students);
        res.render('index', {
            title: "Welcome to Full-Stack",
            students
        });
    });

});

module.exports = router;
