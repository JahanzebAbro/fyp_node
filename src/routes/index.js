const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const User = require('../models/userModel');
const hashPassword = require('../public/scripts/password_utils').hashPassword;
var passport = require('passport');




router.get("/", (req, res) => {
    res.render("index");
});


// LOGIN USER
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login/password", passport.authenticate('local', {
    successReturnToOrRedirect: '/dashboard',
    failureRedirect: '/login',
    failureMessage: true
  })
);


//  REGISTER USER
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {

    const { email, pwd, cf_pwd, user_type } = req.body;
    console.log('Received:', email, pwd, cf_pwd, user_type);

    let errors = [];

    if (pwd.length < 6){
        errors.push({message: "Password should be at least 6 characters!"});
    }

    if (pwd != cf_pwd){
        errors.push({message: "Passwords do not match!"});
    }

    if (errors.length > 0){
        res.render("register", { errors });
    }else{
        // Form has passed

        query = `SELECT * FROM users WHERE email = ($1)`;
        params = [email];

        pool.query(query, params, async (err, results) => {
            if(err){
                throw err;
            }

            if(results.rows.length > 0){
                errors.push({message: "Email already registered!"});
                res.render("register", { errors });
            }
            else{

                const hashed = await hashPassword(pwd);

                let userId = await User.create(pool, email, hashed, user_type);
                
                if (userId != null){
                    req.flash("sucess_reg", "You are registered now!");
                    res.redirect("login");
                }
            }
        })


    }
});


module.exports = router;