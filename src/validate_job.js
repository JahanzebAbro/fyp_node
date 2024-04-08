const Job = require('./models/jobModel');
const Benefit = require('./models/benefitModel');
const pool = require("./config/db/db_config");

const title_regex = /[^a-zA-Z\s]+/; // Only letters and spaces.

const description_regex = /^$|^[a-zA-Z0-9 .,!?;:'"“”‘’\-_\n]+$/;

// Reference: https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
const date_regex = 
/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;


exports.validateJobStatus = function(req, res, next){

    const { status } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if (status !== 'open' && status !== 'hidden' && status !== 'closed'){
        req.validation_errors.status = "Please select a given job status.";
    }



    next();
}


exports.validateJobTitle = function(req, res, next) {
    
    const { job_title } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }


    if(job_title == '' || job_title == null){
        req.validation_errors.job_title = "Title cannot be left empty.";
    } 
    else if(job_title.length < 2){
        req.validation_errors.job_title = "Title cannot have less than 2 characters.";
    } 
    else if(job_title.length > 50){
        req.validation_errors.job_title = "Title cannot exceed 50 characters.";
    }
    else if (title_regex.test(job_title)) {
        req.validation_errors.job_title = "Title can only contain letters.";
    }


    next();
}


exports.validateOpenings = function(req, res, next){

    const { openings } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    if(openings){

        const size = parseInt(openings, 10); // Parse to int in decimal system

        if (isNaN(size) || size <= 0) { // Check if is Not-A-Number or is less than or equal to zero.
            req.validation_errors.openings = "Openings must be a positive integer.";
        }

        else if(size > 100){
            req.validation_errors.openings = "Openings is too unreasonably large of a value.";
        }

    }

    next();
}


// Type is a MULTI CHOICE field
exports.validateJobType = async function(req, res, next){

    let { job_type } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }
    
    // Expected Inputs are: single string and array of strings
    // Strings are index values of job type table
    // Must compare all strings with index in database.


    // Check for single string and turn into an array if so.
    job_type = Array.isArray(job_type) ? job_type : [job_type];

    const valid_types = await Job.getAllJobTypes(pool);
    const valid_ids = valid_types.map(type => type.id.toString()); // creates array of id strings

    for (const type of job_type) { // Go through every given type until we find error.

        if (!valid_ids.includes(type)) {

            req.validation_errors.job_type = "Please select valid job type(s).";

            break;
        }
    }



    next();
}


// Style is a SINGLE CHOICE field
exports.validateJobStyle = function(req, res, next){

    const { job_style } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    
    if (job_style !== 'In-person' && job_style !== 'Remote' && job_style !== 'Hybrid'){
        req.validation_errors.job_style = "Please select a given job style.";
    }


    next();
}



exports.validateDescription = function(req, res, next){

    const { description } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }


    if (description.length > 5000) {
        req.validation_errors.description = 'Description cannot exceed 5000 characters.'; 
    }
    else if (!description_regex.test(description)) {
        req.validation_errors.description = 'Contains invalid characters'; 
    }



    next();
}



exports.validatePay = function(req, res, next){

    const { min_pay, max_pay } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Min and max pay are optional
    // Min cannot be greater than max and vice versa
    // Must check they are positive integers. 

    if(min_pay){

        const min_pay_int = parseInt(min_pay, 10); // Parse to int in decimal system
        
        if (isNaN(min_pay_int)) { // Check if is Not-A-Number
            req.validation_errors.pay = "Minimum payment values must be an integer.";
        }

        else if (min_pay_int <= 0) { // Check if less or equal to zero.
            req.validation_errors.pay = "Minimum payment values must be positive.";
        }

        else if(min_pay > 1000000){ // Set cap of a million
            req.validation_errors.pay = "Minimum payment is unreasonably large of a value.";
        }
    }

    else if(max_pay){

        const max_pay_int = parseInt(min_pay, 10); // Parse to int in decimal system

        if (isNaN(max_pay_int)) { // Check if is Not-A-Number
            req.validation_errors.pay = "Maximum payment values must be an integer.";
        }

        else if (max_pay_int <= 0) { // Check if less or equal to zero.
            req.validation_errors.pay = "Maximum payment values must be positive.";
        }

        else if(max_pay > 1000000){ // Set cap of a million
            req.validation_errors.pay = "Maximumayment is unreasonably large of a value.";
        }
    }


    next();
}



exports.validateStartDate = function(req, res, next){

    const { start_date } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Want to make sure the date is in the right format yyyy-mm-dd
    // Want to make sure startdate is not before or at the current date.
    // Want to make sure start date is not over a year from current date.

    if(start_date){ // Only if given

        let curr_date = new Date();

        let min_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate()); // Today
        let max_date = new Date(curr_date.getFullYear() + 1, curr_date.getMonth(), curr_date.getDate()); // A year from today

        // Check for format
        if(!date_regex.test(start_date)){
            req.validation_errors.start_date = "Start date must be in valid format.";
        }
        // Check for min range
        else if (start_date <= min_date) {
            req.validation_errors.start_date = "Start date can only be set to a future date.";
        }
        else if (start_date > max_date) {
            req.validation_errors.start_date = "Start date can only be set to within a year from today.";
        }

    }




    next();
}



exports.validateDeadline = function(req, res, next){

    const { deadline } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Want to make sure the date is in the right format yyyy-mm-dd
    // Want to make sure deadline is not before the current date.
    // Want to make sure deadline is not over a year from current date.

    if(deadline){ // Only if given

        let curr_date = new Date();

        let min_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate()); // Today
        let max_date = new Date(curr_date.getFullYear() + 1, curr_date.getMonth(), curr_date.getDate()); // A year from today

        // Check for format
        if(!date_regex.test(deadline)){
            req.validation_errors.deadline = "Deadline must be in valid format.";
        }
        // Check for min range
        else if (deadline < min_date) {
            req.validation_errors.deadline = "Deadline cannot be set before today.";
        }
        else if (deadline > max_date) {
            req.validation_errors.deadline = "Deadline can only be set to within a year from today.";
        }

    }



    next();
}



exports.validateBenefits = async function(req, res, next){

    let { benefits } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Benefits can either come in single string or array
    // Check with benefits database if chosen exists.
    // Make sure not more than 5 can be chosen.



    if(benefits){ // Only if given

        // Check for single string and turn into an array if so.
        benefits = Array.isArray(benefits) ? benefits : [benefits];

        if(benefits.length > 5){
            req.validation_errors.benefits = "You can only select up to 5 benefits.";
        }

        const valid_benefits = await Benefit.getAll(pool);
        const valid_ids = valid_benefits.map(benefit => benefit.id.toString()); // creates array of id strings

        for (const benefit of benefits) { // Go through every given benefit until we find error.

            if (!valid_ids.includes(benefit)) {

                req.validation_errors.benefits = "Please select valid benefit(s).";

                break;
            }
        }



    }


    next();
}



exports.validateCustomBenefits= function(req, res, next){

    let { custom_benefits } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Customs can either come in single string or array
    // Make sure not more than 3 customs are given.
    // Make sure customs are valid format, only letters and spaces allowed.
    // Make sure customs are right length, min 3 and max 50 characters.

    if(custom_benefits){ // Only if given

        // Check for single string and turn into an array if so.
        custom_benefits = Array.isArray(custom_benefits) ? custom_benefits : [custom_benefits];

        if(custom_benefits.length > 3){
            req.validation_errors.custom_benefits = "You can only create up to 3 custom benefits.";
        }

        for (const benefit of custom_benefits){

            if(benefit.length < 3){
                req.validation_errors.custom_benefits = "Custom benefit must have at least 3 characters.";
                break;
            } 
            else if(benefit.length > 50){
                req.validation_errors.custom_benefits = "Custom benefit cannot exceed 50 characters.";
                break;
            }
            else if (title_regex.test(benefit)) { // Same regex pattern so reusing title regex.
                req.validation_errors.custom_benefits = "Custom benefit can only contain letters.";
                break;
            }

        }
        
    }



    next();
}



exports.validateQuestions = function(req, res, next){

    const { questions, response_types, 
        question_reqs_1, 
        question_reqs_2,
        question_reqs_3,
        question_reqs_4,
        question_reqs_5 } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Make sure no more than 5 questions are given.
    // So check questions, response types for length
    // Make sure question is in valid format, similar to description regex pattern.
    // Make sure response_type are all the allowed ones.
    // Check question_reqs_x are bools.





    next();
}



exports.validateSkills = function(req, res, next){

    let { skills } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    // Skills can either come in single string or array
    // Make sure not more than 5 skills are given.
    // Make sure skills are valid format, only letters and spaces allowed.
    // Make sure customs are right length, min 3 and max 50 characters.

    if(skills){ // Only if given

        // Check for single string and turn into an array if so.
        skills = Array.isArray(skills) ? skills : [skills];

        if(skills.length > 5){
            req.validation_errors.skills = "You can only create up to 5 skills.";
        }

        let i = 1; // To identify which skill commits error first.
        for (const skill of skills){

            if(skill.length < 3){
                req.validation_errors.skills = `Skill ${i} must have at least 3 characters.`;
                break;
            } 
            else if(skill.length > 50){
                req.validation_errors.skills = `Skill ${i} cannot exceed 50 characters.`;
                break;
            }
            else if (title_regex.test(skill)) { // Same regex pattern so reusing title regex.
                req.validation_errors.skills = `Skill ${i} should only contain letters.`;
                break;
            }

            i++;
        }
        
    }

    next();
}



exports.validateCVReq = function(req, res, next){

    const { cv_req } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    
    if (cv_req !== 'true' && cv_req !== 'false') {
        req.validation_errors.cv_req = "Please select a valid option.";
    }


    next();
}