const express = require("express");
const router = express.Router();
const path = require('path');
const pool = require("../config/db/db_config");
const Seeker = require('../models/seekerModel');
const { isNotAuthReq } = require('../utils');
const { isProfileBuilt } = require('../utils');
const { deleteUpload } = require('../utils');
const { validateFirstName, 
        validateLastName,
        validateDOB,
        validateBio,
        validateAddress,
        validateEmail,
        validatePhone,
        validatePostcode,
        validateGender,
        validateIndustry,
        validateWorkStatus,
        validateFile } = require('../validate_utils');


// MULTER FILE UPLOADS

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
  
const upload = multer({ storage: storage,
                        fileFilter: validateFile,
                        limits: { fileSize: 2 * 1024 * 1024 }}); // 2MB LIMIT

const seekerUpload = upload.fields([{ name: 'cv_file', maxCount: 1 }, { name: 'profile_pic_file', maxCount: 1 }]);





// ENDPOINTS
// ------------DASHBOARD
router.get("/dashboard", isNotAuthReq, (req, res) => {
    res.render("user/dashboard");
});




// ------------USER PROFILE PAGE
router.get("/profile", isNotAuthReq, isProfileBuilt, async (req, res) => {
    res.render("user/profile");
});


router.post('/update-profile', isNotAuthReq, seekerUpload, async (req, res) => {
    try {

        const updates = req.body; 
        const old_seeker = await Seeker.getById(pool, req.user.id); // To delete old file paths
       
        let result = '';

        // Handling Profile picture update
        if(req.files['profile_pic_file'] && req.files['profile_pic_file'][0]){ // If a new file was inputted

            // delete old one if exists and not equal to the new one
            const pic_new_name = req.files['profile_pic_file'][0].filename
            if (old_seeker.profile_pic && old_seeker.profile_pic !== pic_new_name ) { 
                deleteUpload(path.join('uploads/' , old_seeker.profile_pic));
            } 

            // Append profile_pic name to updates
            updates.profile_pic_file = pic_new_name;
        }
        else{ // No file was inputted so string with old file or null was sent.

            // Delete if string is not equal to an existing file
            if (old_seeker.profile_pic && old_seeker.profile_pic !== req.body.profile_pic_file ) {
                deleteUpload(path.join('uploads/' , old_seeker.profile_pic));
            } 
        }

        // ==============================

        // Handling CV file update
        if (req.files['cv_file'] && req.files['cv_file'][0]) {
            
            let cv_new_name = req.files['cv_file'][0].filename;
            // If new file uploaded is same as old one, don't delete
            if (old_seeker.cv && old_seeker.cv !== cv_new_name) {
                deleteUpload(path.join('uploads/', old_seeker.cv));
            }
            updates.cv_file = cv_new_name; // Adjust this line to match your database column for CV
        }

        // If new cv request is empty. Which means user wants to clear.
        if (req.body.cv_file && req.body.cv_file.trim() === 'clear'){
            deleteUpload(path.join('uploads/', old_seeker.cv));
            updates.cv_file = '';
        }

        
        result = await Seeker.update(pool, req.user.id, updates);
        
        // Respond with success message or the updated seeker data
        res.json({ success: true, message: 'Profile updated successfully', seeker: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
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



// SUBMIT POINT FOR BUILDER
router.post("/profile/builder", isNotAuthReq, seekerUpload, validateFirstName,
                                                            validateLastName,
                                                            validateGender,
                                                            validateDOB,
                                                            validateBio,
                                                            validateAddress,
                                                            validatePostcode,
                                                            validatePhone,
                                                            validateEmail,
                                                            validateIndustry,
                                                            validateWorkStatus,
                                                            multerSizeErrorHandler,
                                                            fileErrorHandler,
                                                            allErrorHandler, async (req, res) => {


    try{
        
        const user_id = req.user.id;
        let { f_name, l_name, gender, d_o_b, bio, address, postcode, ct_phone, ct_email, industry, work_status } = req.body;

        let cv_file = '';
        if (req.files['cv_file'] && req.files['cv_file'][0]){ // Check if a file was given
            cv_file = req.files['cv'][0].filename;
        }
        
        let profile_pic_file = '';
        if (req.files['profile_pic_file'] && req.files['profile_pic_file'][0]){ // Check if a file was given
            profile_pic_file = req.files['profile_pic_file'][0].filename;
        }


        // TRIMMING 
        bio = bio.trim();


        let result = await Seeker.create(pool, 
            user_id, 
            f_name, 
            l_name, 
            gender, 
            d_o_b, 
            bio, 
            cv_file, 
            profile_pic_file, 
            address, 
            postcode, 
            ct_phone, 
            ct_email, 
            industry, 
            work_status);
        

        if(result){
            res.status(200).json({ success: true, message: 'Profile builder completed!', seeker: result });
        }
        else{
            res.status(400).json({ success: false, message: 'Error in creating profile!', seeker: result });
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error
    }

});



// -------------LOGOUT
router.get("/logout", isNotAuthReq, (req, res) => {
    // Clear the session
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect("/");
    });
    
});



// To catch multer size error
function multerSizeErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // Check if the error is due to file size
        if (err.code === 'LIMIT_FILE_SIZE') {

            if (!req.validation_errors) {
                req.validation_errors = {};
            }
            
            const field_name = err.field || 'file'; 
            req.validation_errors[field_name] = `File must be less than 2MB.`;
        }

    }

    next();
}

// Used for adding file errors to validation error chain
function fileErrorHandler(req, res, next){

    // console.log("File errors:", req.file_errors);

    if (req.file_errors) {
        
        if (!req.validation_errors) { // add to chain storage with rest of errors
            req.validation_errors = {}
        };

        // Places cv or profile_pic
        Object.keys(req.file_errors).forEach(field => {
            req.validation_errors[field] = req.file_errors[field];
        });
    }

    next();
}

// Used to check validation error chain and return if exists.
function allErrorHandler(req, res, next){

    // Check if there were any validation errors
    if (req.validation_errors && Object.keys(req.validation_errors).length > 0) {
        
        console.log("Validation Errors:", req.validation_errors);

        // Send all errors back in the response
        return res.status(400).json({ errors: req.validation_errors });
    }

    next();
}


module.exports = router;
