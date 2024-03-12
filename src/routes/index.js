const express = require("express");
const router = express.Router();
const pool = require("../db/db_config");
const bcrypt = require('bcrypt');



router.get("/", (req, res) => {
    res.render("index");
});


// LOGIN USER
router.get("/login", (req, res) => {
    // req.flash('success', 'Login successful!');
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const { email, pwd } = req.body;
    
        query = 'SELECT * FROM users WHERE email = ($1)';
        params = [email]; 
            
        const result = await pool.query(query, params);
        console.log(result.rows[0]);

        res.render("dashboard", { 
        id: result.rows[0].id, 
        type: result.rows[0].user_type
        });
    }
    catch (err){
        console.error(err.message);
    }

});


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

        const hashed = await hashPassword(pwd);

        query = 'SELECT * FROM users WHERE email = $1';
        params = [email];

        pool.query(query, params, (err, results) => {
            if(err){
                throw err;
            }

            if(results.rows.length > 0){
                errors.push({message: "Email already registered!"});
                res.render("register", { errors });
            }
            else{
                query = 'INSERT INTO users(email, password, user_type) VALUES ($1, $2, $3)';
                params = [email, hashed, user_type];

                pool.query(query, params, (err, results) =>{
                    req.flash("sucess_reg", "You are registered now!");
                    res.redirect("login");
                });
            }
        })


    }
});



// Hash password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
module.exports = router;