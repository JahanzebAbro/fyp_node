const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const { isNotAuthReq } = require('../utils');
const countries = require('country-list');
// const isNotAuthReq = require('../public/scripts/auth_middleware').isNotAuthReq;


router.get("/dashboard", isNotAuthReq, (req, res) => {
    res.render("user/dashboard");
});

router.get("/profile", isNotAuthReq, (req, res) => {
    res.render("user/profile");
});

router.get("/profile/builder", isNotAuthReq, (req, res) => {
    country_list = countries.getCodeList();
    res.render("user/seeker_builder", { country_list });
})

router.get("/logout",isNotAuthReq, (req, res) => {
    // Clear the session
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect("/");
    });
    
});
    
// // Whenever router sees the param id it runs this
// // middleware code (action between req. and res.)

// const users = [{name: "Bilbo"}, {name: "Keisha"}];
// router.param("id", (req, res, next, id) => {
//     req.user = users[id];
//     next();
// })



module.exports = router;