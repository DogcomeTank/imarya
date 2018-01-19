const express = require('express');
const router = express.Router();

router.get('/',(req, res)=>{
    console.log(req.user);
    res.render('chat');
})

router.post('/chat/chatHistory', (req, res) => {
    const mHistory = new ChatHistory(req.body);
    history.find({}, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('chat');
    });
});

module.exports = router;