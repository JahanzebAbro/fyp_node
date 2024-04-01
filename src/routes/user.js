const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Seeker = require('../models/seekerModel');
const { isNotAuthReq } = require('../utils');
const { isProfileBuilt } = require('../utils');


const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Extract the extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); 
    }
});
  
const upload = multer({ storage: storage })
// const upload = multer({ dest: 'uploads/' });
const seekerUpload = upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'profile_pic', maxCount: 1 }]);

// ------------DASHBOARD
router.get("/dashboard", isNotAuthReq, (req, res) => {
    res.render("user/dashboard");
});




// ------------USER PROFILE PAGE
router.get("/profile", isNotAuthReq, isProfileBuilt, async (req, res) => {
    res.render("user/profile");
});





// ------------USER BUILDER FORM
router.get("/profile/builder", isNotAuthReq, async (req, res) => {

    // If a seeker profile exists, redirect the user away from the builder page
    const seeker = await Seeker.getById(pool, req.user.id);
    if (seeker) {
        return res.redirect('/user/profile'); 
    }                       

    res.render("user/seeker_builder");
});

// Submission
router.post("/profile/builder", isNotAuthReq, seekerUpload, async (req, res) => {

    let cv = '';
    if (req.files['cv'] && req.files['cv'][0]){ // Check if a file was given
        cv = req.files['cv'][0].filename;
    }
    
    let profile_pic = '';
    if (req.files['profile_pic'] && req.files['profile_pic'][0]){ // Check if a file was given
        profile_pic = req.files['profile_pic'][0].filename;
    }

    let { f_name, l_name, gender, d_o_b, bio, address, postcode, ct_phone, ct_email, industry, work_status } = req.body;

     // Nulling empty strings for non-mandatory fields (except status).
     gender = gender.trim() || null;
     bio = bio.trim() || null;
     address = address.trim() || null;
     postcode = postcode.trim() || null;
     ct_phone = ct_phone.trim() || null;
     ct_email = ct_email.trim() || null;
     industry = industry.trim() || null;

    const user_id = req.user.id;
    let result = await Seeker.create(pool, 
        user_id, f_name, l_name, gender, d_o_b, bio, cv, profile_pic, address, postcode, ct_phone, ct_email, industry, work_status
        );
    
        console.log(result);

    if(result){
        res.redirect("/user/profile");
    }
    else{
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
    

module.exports = router;