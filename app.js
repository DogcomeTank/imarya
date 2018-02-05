const express = require('express')
const app = express()
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const keys = require('./models/keys');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
//app.use(logger('dev')); // log requests in server console
app.use(bodyParser.json()); // parse client request data to json format
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/')));
app.use(session({
    secret: keys.sessionSecrete.mySecrete,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //only set this to true if you are in HTTPS connection
}));

//user authentication local
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


//passport google config
const GoogleLoginConfig = require('./config/googleConfig');

// connect mongoDB
mongoose.connect(keys.mongoose.link, { useMongoClient:true });
mongoose.Promise = global.Promise

//router
const index = require('./routes/product');
const login = require('./config/loginConfig');
//const localLogin = require('./routes/userLocalRoutes');
//const googleRoutes = require('./routes/loginWithGoogle/googleRoutes');

//
app.use(bodyParser.urlencoded({
    extended: true
}))



app.use('/', index);
app.use('/login', login);
//app.use('/oAuth', localLogin);
//app.use('/googleOauth/',googleRoutes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});
