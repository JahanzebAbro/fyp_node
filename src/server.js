const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

// App configuration
app.use(express.static(__dirname + '/public')); 
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(logger); 


// Index paths
const indexRouter = require("./routes/index");
app.use("/", indexRouter);


// User paths
const userRouter = require("./routes/users");
app.use("/users", userRouter);


// Custom middleware functions
function logger(req, res, next){
    console.log(req.originalUrl);
    next();
}

app.listen(process.env.PORT || 3000);