if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const pool = require("./config/db/db_config");
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const initializePassport = require('./config/passport_config');
var passport = require('passport');
const flash = require('express-flash');

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

// Initliaze configs
app.use(express.static(__dirname + '/public')); 
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(logger); 


// Session Config
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 2, // Expires in two hours 
    }
}));

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session()); // Handles user serialization and deserialization

app.use((req, res, next) =>{
    console.log(req.session);
    // console.log(req.user);
    next();
})

app.use(flash());

// Middleware to prevent cache from loading pages that are restricted for non-auth users.
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// Index paths
const indexRouter = require("./routes/index");
app.use("/", indexRouter);


// User paths
const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.use(errorHandler);






// Custom middleware functions
function logger(req, res, next){
    console.log(req.originalUrl);
    next();
}

function errorHandler(err, req, res, next){
    if (err){
        res.send("There was an error. Please try again later!");
        console.log(err);
    }
}

app.listen(process.env.PORT || 3000);