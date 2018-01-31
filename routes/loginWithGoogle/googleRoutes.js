//routes

const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) => {
    res.render('users/login');
});

//auth logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
    scope: ['email'],
}));

//auth with Google call back
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
        req.session.webUser = {
            'username': req.user.username,
            'accessLevel': req.user.accessLevel
        };
        res.redirect('/');
});

//logout 
router.get('/google/logout', function (req, res) {
    req.session.destroy(function (e) {
        req.logout();
        console.log(req.user);
        res.redirect('/');
    });
});

module.exports = router;