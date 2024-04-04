const path = require('path');
const { findIndustryName } = require('./utils');

// ====================REGEX CODES

// Reference: https://a-tokyo.medium.com/first-and-last-name-validation-for-forms-and-databases-d3edf29ad29d
const name_regex = 
/^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+([ \-']{0,1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+){0,2}[.]{0,1}$/;

// Reference: https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
const date_regex = 
/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

// Reference: https://ideal-postcodes.co.uk/guides/postcode-validation
// This only allows UK postcodes
const postcode_regex = 
/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i; 

// Reference: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
const phone_regex = 
/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

// Reference: https://emailregex.com/
const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Reference: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const website_regex =
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const bio_regex = /^$|^[a-zA-Z0-9 .,!?;:'"“”‘’\-_\n]+$/;
const address_regex = /^$|^[a-zA-Z0-9\s,.'-]{3,150}$/; 


// Gender, Industry, Work Status, Profile Pic, CV 


// ======================VALIDATION FUNCTIONS

exports.validateFirstName = function(req, res, next) {
    
    const { f_name } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }


    if(f_name == '' || f_name == null){
        req.validation_errors.f_name = "First name cannot be left empty.";
    } 
    else if(f_name.length < 2){
        req.validation_errors.f_name = "First name cannot have less than 2 characters.";
    } 
    else if(f_name.length > 50){
        req.validation_errors.f_name = "First name cannot exceed 50 characters.";
    }
    else if (!name_regex.test(f_name)) {
        req.validation_errors.f_name = "First name must not contain certain special characters.";
    }


    next();
}


exports.validateLastName = function(req, res, next) {
    
    const { l_name } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }


    if(l_name == '' || l_name == null){
        req.validation_errors.l_name = "Last name cannot be left empty.";
    } 
    else if(l_name.length < 2){
        req.validation_errors.l_name = "Last name cannot have less than 2 characters.";
    } 
    else if(l_name.length > 50){
        req.validation_errors.l_name = "Last name cannot exceed 50 characters.";
    } 
    else if (!name_regex.test(l_name)) {
        req.validation_errors.l_name = "Last name must not contain certain special characters.";
    }

    next();
}


exports.validateDOB = function(req, res, next) {
    
    const { d_o_b } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }
    
    const {min_date, max_date} = findMinAndMaxDOB();

    // Check for null
    if(d_o_b === '' || d_o_b === null){
        req.validation_errors.d_o_b = "Date of birth cannot be left empty.";
    }
    // Check for format
    else if(!date_regex.test(d_o_b)){
        req.validation_errors.d_o_b = "Date of birth must be in valid format.";
    }
    // Check for range
    else if (d_o_b < min_date || d_o_b > max_date) {
        req.validation_errors.d_o_b = "Date of birth must be in range of a valid age.";
    }

    next();
}


exports.validateBio = function(req, res, next) {
    
    const { bio } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    
    if (bio.length > 800) {
        req.validation_errors.bio = 'Bio cannot exceed 800 characters.'; 
    }
    else if (!bio_regex.test(bio)) {
        req.validation_errors.bio = 'Contains invalid characters'; 
    }

    next();
}


exports.validateAddress = function(req, res, next) {
    
    const { address } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    
    if (address.length > 150) {
        req.validation_errors.address = 'Address cannot exceed 150 characters.'; 
    }
    else if (address && !address_regex.test(address)) {
        if(address.length < 3){
            req.validation_errors.address = 'Address cannot be less than 3 characters.'; 
        }
        else{
            req.validation_errors.address = 'Contains invalid characters'; 
        }
    }

    next();
}


exports.validateEmail = function(req, res, next) {

    const { ct_email } = req.body;

    if (!req.validation_errors){
        req.validation_errors = {};
    }

    if (ct_email && !email_regex.test(ct_email)) {

        req.validation_errors.ct_email = "Please enter a valid email address.";
    }

    next();
}


exports.validatePhone = function(req, res, next) {

    const { ct_phone } = req.body;

    if (!req.validation_errors){
        req.validation_errors = {};
    }

    if (ct_phone && !phone_regex.test(ct_phone)) {

        req.validation_errors.ct_phone = "Please enter a valid phone number.";

    }

    next();
}


exports.validatePostcode = function(req, res, next) {

    const { postcode } = req.body;

    if (!req.validation_errors){
        req.validation_errors = {};
    }

    if (postcode && !postcode_regex.test(postcode)) {

        req.validation_errors.postcode = "Please enter a valid UK postcode.";

    }

    next();
}


exports.validateGender = function(req, res, next){

    const { gender } = req.body;

    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if (gender) {
        
        if (gender !== 'Male' && gender !== 'Female' && gender !== 'Other'){
            req.validation_errors.gender = "Please select a given gender type.";
        }

    }

    next();
}


exports.validateIndustry = function(req, res, next){
    const { industry } = req.body;

    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if (industry && !findIndustryName(industry)) {
        // If no industry found of that code.
        req.validation_errors.industry = "Please select a valid industry.";
    }    

    next();

}


exports.validateWorkStatus = function(req, res, next){

    const { work_status } = req.body;

    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if (work_status !== 'true' && work_status !== 'false') {
        req.validation_errors.work_status = "Please select a valid work status.";
    }

    next();
}


exports.validateFile = function(req, file, cb){

    const pic_file_types = /jpeg|jpg|png|gif/;
    const cv_file_types = /pdf/;

    let is_valid = false;

    // Storage
    if (!req.file_errors) {
        req.file_errors = {};
    }

    if (file.fieldname === 'profile_pic_file') { 
        is_valid = pic_file_types.test(path.extname(file.originalname).toLowerCase()) && pic_file_types.test(file.mimetype);
    } else if (file.fieldname === 'cv_file') { 
        is_valid = cv_file_types.test(path.extname(file.originalname).toLowerCase()) && cv_file_types.test(file.mimetype);
    }

    if (!is_valid && file.fieldname) {
        req.file_errors[file.fieldname] = 'Invalid file type!';
    } 

    cb(null, true); 

    
}


exports.validateCompanyName = function(req, res, next){

    const { comp_name } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }


    if(comp_name == '' || comp_name == null){
        req.validation_errors.comp_name = "Company name cannot be left empty.";
    } 
    else if(comp_name.length < 2){
        req.validation_errors.comp_name = "Company name cannot have less than 2 characters.";
    } 
    else if(comp_name.length > 50){
        req.validation_errors.comp_name = "Company name cannot exceed 50 characters.";
    }
    else if (!name_regex.test(comp_name)) {
        req.validation_errors.comp_name = "Company name must not contain certain special characters.";
    }

    next();
}


exports.validateCompanySize = function(req, res, next){

    const { comp_size } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if(comp_size){

        const size = parseInt(comp_size, 10); // Parse to int in decimal system

        if (isNaN(size) || size <= 0) { // Check if is Not-A-Number or is less than or equal to zero.
            req.validation_errors.comp_size = "Company size must be a positive integer.";
        }

    }

    next();
}


exports.validateWebsite = function(req, res, next){

    const { website } = req.body;

    if (!req.validation_errors){
        req.validation_errors = {};
    }

    if (website && !website_regex.test(website)) {

        req.validation_errors.website = "Please enter a valid website url.";

    }

    next();
}





// HELPER FUNCTIONS

function findMinAndMaxDOB(){
    let curr_date = new Date();
    
    // Setting max date to 18 years and min date to 100 years ago from today.
    let min_date = new Date(curr_date.getFullYear() - 100, curr_date.getMonth(), curr_date.getDate());
    let max_date = new Date(curr_date.getFullYear() - 18, curr_date.getMonth(), curr_date.getDate());
    
    //splits the ISO string at the 'T' character, separating the date part from the time part.
    min_date = min_date.toISOString().split('T')[0]; 
    max_date = max_date.toISOString().split('T')[0]; 

    return { min_date, max_date };
}