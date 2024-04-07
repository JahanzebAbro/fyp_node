const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const User = require('../models/userModel');
const { hashPassword, newPasswordAuth, isAuthReq } = require('../utils');
var passport = require('passport');



// HOME
router.get("/", (req, res) => {
    res.render("index");
});


// LOGIN USER
router.get("/login", isAuthReq, (req, res) => {
    res.render("index/login");
});




router.post("/login", passport.authenticate('local', {
    successReturnToOrRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);




//  REGISTER USER
router.get("/register", isAuthReq, (req, res) => {

    // Grabbing previous form submission if exists
    const form_data = req.session.form_data || {};

    res.render("index/register", { form_data});
});




router.post("/register", async (req, res) => {

    const { email, pwd, cf_pwd, user_type } = req.body;
    console.log('Received:', email, pwd, cf_pwd, user_type);

    // Saving inputs for resubmission
    req.session.form_data = { email: email, user_type: user_type};
    const form_data =  req.session.form_data; 

    // Password checks
    password_err = newPasswordAuth(pwd, cf_pwd);
    if(password_err){
        req.flash("reg_auth", password_err);
        return res.render("index/register", { form_data});
    }

    
    // Form has passed password checks

    const hashed = await hashPassword(pwd);
    result = await User.create(pool, email, hashed, user_type);

    if(result){
        req.flash("sucess_reg", "You are registered now!");
        res.redirect("/login");
    }else{
        req.flash("reg_auth", "Email already exists!");
        return res.render("index/register", { form_data });  
    }   
        
});


module.exports = router;