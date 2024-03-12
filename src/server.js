if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

// Initliaze configs
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(logger); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    // store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());


// Index paths
const indexRouter = require("./routes/index");
app.use("/", indexRouter);


// User paths
const userRouter = require("./routes/users");
app.use("/users", userRouter);

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