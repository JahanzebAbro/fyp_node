const bcrypt = require('bcrypt');
const pool = require('./config/db/db_config'); 
const Seeker = require('./models/seekerModel');
const Employer = require('./models/employerModel');
const fs = require('fs');
// ------------------Password Utilities

// Encrypt password
exports.hashPassword = async function (password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (err) {
        // Handle the error, log it, or throw a custom error
        throw err;
    }
}

// Make sure password is valid and equal to confirmed password. Returns error string if not.
exports.newPasswordAuth = function (pwd, cf_pwd){

    // Check to see if confirmed password is equal to password.
    if (pwd != cf_pwd){
        return "Passwords do not match!";
    }

    regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    
    // Check against password against regex, and find missing requirement(s)
    if (!regex.test(pwd)) {
        let regex_err = "Password must meet the following requirements:\n";
    
        if (!/(?=.*\d)/.test(pwd)) {
            regex_err += "- At least one digit.\n";
        }
    
        if (!/(?=.*[A-Z])/.test(pwd)) {
            regex_err += "- At least one uppercase letter.\n";
        }
    
        if (!/(?=.*[a-z])/.test(pwd)) {
            regex_err += "- At least one lowercase letter.\n";
        }
    
        if (!/(?=.*[^\w\d\s:])/.test(pwd)) {
            regex_err += "- At least one special character.\n";
        }
    
        if (pwd.length < 8 || pwd.length > 32) {
            regex_err += "- Password length should be between 8 and 32 characters.\n";
        }
    
        return regex_err;
    }
    
    // All checks cleared
    return null;
}


//--------------------Session Authentication


// Check to see if user is logged in by checking session passport.
exports.isNotAuthReq = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(401).render("401", { url: req.originalUrl });
    }
}



// To redirect logged in users away from login and register page.
exports.isAuthReq = function (req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("user/dashboard");
    }

    next();
    
}

// Return name string for a sting code of an industry.
exports.findIndustryName = function(code){
    const industries = {
        "": "None", 
        "IT": "Information Technology",
        "MED": "Medicine",
        "ECMM": "Ecommerce",
        "CAR": "Car Dealership",
        "FIN": "Finance",
        "EDU": "Education",
        "MAN": "Manufacturing",
        "TRA": "Transportation",
        "HOS": "Hospitality",
        "ART": "Art and Design",
        "ENT": "Entertainment",
        "AGR": "Agriculture",
        "CON": "Construction",
        "PHA": "Pharmaceuticals",
        "TEL": "Telecommunications",
        "RST": "Restaurant",
        "COS": "Cosmetics",
        "FIT": "Fitness",
        "TRV": "Travel",
        "ADV": "Advertising"
    };

    const industry = industries[code] || null;

    return industry;
}


// Determine if profile built and for which user type.
exports.isProfileBuilt = async function (req, res, next) {
    if (req.isAuthenticated()) {

        let profile = null;

        // Determine the type of user and fetch the corresponding profile
        if (req.user.user_type === 'seeker') {

            const seeker = await Seeker.getById(pool, req.user.id);
            if (seeker && seeker.industry) {
                seeker.industry_name = exports.findIndustryName(seeker.industry);
            }
            profile = seeker;

        } 
        else if (req.user.user_type === 'employer') {

            const employer = await Employer.getById(pool, req.user.id);
            if (employer && employer.industry) {
                employer.industry_name = exports.findIndustryName(employer.industry);
            }
            profile = employer;

        }

        res.locals.profile = profile ? profile : false;
    } else {
        res.locals.profile = false;
    }

    next();
}


exports.deleteUpload = function(file_path) {
    fs.unlink(file_path, (err) => {
        if (err) {
            console.error('Error in deleting file:', err);
        } else {
            console.log('Old file deleted.');
        }
    });
}