const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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
