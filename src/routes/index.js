const express = require("express");
const router = express.Router();
const pool = require("../db/db_config");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});


//  REGISTER USER
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    res.send("User registered!");

    const { user_email, pwd, user_type } = req.body;
    console.log('Received form data:', user_email, pwd, user_type);
});

module.exports = router;