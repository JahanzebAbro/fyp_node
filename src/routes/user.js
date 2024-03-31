const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Seeker = require('../models/seekerModel');
const { isNotAuthReq } = require('../utils');
const { isProfileBuilt } = require('../utils');
const countries = require('country-list');
// const isNotAuthReq = require('../public/scripts/auth_middleware').isNotAuthReq;


// ------------DASHBOARD
router.get("/dashboard", isNotAuthReq, (req, res) => {
    res.render("user/dashboard");
});




// ------------USER PROFILE PAGE
router.get("/profile", isNotAuthReq, isProfileBuilt, async (req, res) => {
    // const seeker = await Seeker.getById(pool, req.user.id);
    res.render("user/profile");
});





// ------------USER BUILDER FORM
router.get("/profile/builder", isNotAuthReq, async (req, res) => {

    // If a seeker profile exists, redirect the user away from the builder page
    const seeker = await Seeker.getById(pool, req.user.id);
    if (seeker) {
        return res.redirect('/user/profile'); 
    }                       

    country_list = countries.getCodeList();
    res.render("user/seeker_builder", { country_list });
});

// Submission
router.post("/profile/builder", isNotAuthReq, async (req, res) => {

    let { f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry } = req.body;
    console.log('Received:', f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry);
    
    // Nulling empty strings for non-mandatory fields.
    bio = bio.trim() || null;
    country = country.trim() || null;
    postcode = postcode.trim() || null;
    ct_phone = ct_phone.trim() || null;
    ct_email = ct_email.trim() || null;
    industry = industry.trim() || null;        
    
    
    const user_id = req.user.id;
    let result = await Seeker.create(pool, user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry);
    
    if(result){
        res.redirect("/user/profile");
    }else{
        req.flash("build_msg", "Something went wrong! We couldn't complete your profile. Try again later!");
        res.redirect("/user/profile");  
    }
});






// -------------LOGOUT
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