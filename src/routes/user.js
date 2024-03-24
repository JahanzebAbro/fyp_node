const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const isAuthReq = require('../public/scripts/auth_middleware').isAuthReq;


router.get("/dashboard", isAuthReq, (req, res) => {
    res.render("user/dashboard");
});

router.get("/profile", isAuthReq, (req, res) => {
    res.render("user/profile");
});

router.get("/logout",isAuthReq, (req, res) => {
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