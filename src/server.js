const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public')); // static files
app.use(logger); // log URLS

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render("index", {name: "Zuko"});
})

// Different paths available from user
const userRouter = require("./routes/users");

app.use("/users", userRouter);


function logger(req, res, next){
    console.log(req.originalUrl);
    next();
}

app.listen(3000);