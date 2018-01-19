const express = require('express');
const router = express.Router();
const Students = require('../models/students');

router.get('/add', (req, res) => {
    res.render('add');
});

router.post('/add', (req, res) => {
    const student = new Students(req.body);
    student.save((err, doc) => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/:id', (req, res) => {
    Students.findOne({
        _id: req.params.id
    }, (err, student) => {
        if (err) {
            return next(err);
        } else {
            console.log(student);
            res.render('detail', {
                student
            });
        }
    })
})

router.post('/update/:id', (req, res) => {
    Students.update({
        _id: req.params.id
    }, req.body, (err) => {
        if(err){
            return nex(err);
        }
        res.redirect('/');
    });
    console.log(req.params.id, req.body);
})

module.exports = router;
