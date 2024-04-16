const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Seeker = require('../models/seekerModel');
const Employer = require('../models/employerModel');
const { isNotAuthReq } = require('../utils');
const { isProfileBuilt, getUserIcon, allErrorHandler } = require('../utils');
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
        validateFile,
        validateCompanyName,
        validateCompanySize,
        validateWebsite } = require('../validate_utils');


// MULTER FILE UPLOADS

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + '-' + file.originalname); // Appending time since Jan 1970 midnight
    }
});
  
const upload = multer({ storage: storage,
                        fileFilter: validateFile,
                        limits: { fileSize: 2 * 1024 * 1024 }}); // 2MB LIMIT

const seekerUpload = upload.fields([{ name: 'cv_file', maxCount: 1 }, { name: 'profile_pic_file', maxCount: 1 }]);
const employerUpload = upload.fields([{ name: 'profile_pic_file', maxCount: 1 }]);





// ENDPOINTS
// ----------------------------------------DASHBOARD
router.get("/dashboard", isNotAuthReq, getUserIcon, async (req, res) => {

    res.render("user/dashboard", { user_type: req.user.user_type});
});




// ----------------------------------------USER PROFILE PAGE
router.get("/profile", isNotAuthReq, isProfileBuilt,  getUserIcon, async (req, res) => {
    
    if(req.user.user_type === 'seeker'){
        res.render("user/seeker_profile");
    }
 
    if(req.user.user_type === 'employer'){
        res.render("user/employer_profile");
    }
    
});



// UPDATE SEEKER PROFILE FROM EDIT
router.post("/update-profile/seeker", isNotAuthReq, seekerUpload, validateFirstName,
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
    try {

        const updates = req.body; 
        const user_id = req.user.id;
        const old_seeker = await Seeker.getById(pool, user_id); // To delete old file paths


        // =======CV FILE MANAGEMENT

        if (req.files['cv_file'] && req.files['cv_file'][0]){ // Check if a file was given

            updates.cv_file = req.files['cv_file'][0].filename;
            console.log('SAVING', updates.cv_file);

            if(old_seeker.cv){
                console.log(console.log('DELETE', old_seeker.cv));
                deleteUpload('uploads/' + old_seeker.cv);
            }

        }
        else if (old_seeker.cv){ // No file was given but previous file exists

            if(updates.is_cv_cleared === 'true'){ // Asked to clear old file by user

                updates.cv_file = '';
                console.log(console.log('DELETE', old_seeker.cv));
                deleteUpload('uploads/' + old_seeker.cv);

            }else{ // Maintain old file

                updates.cv_file = old_seeker.cv;
                console.log('KEEPING', updates.cv_file);

            }
        }
        else{ // No file was given and no previous file exists
            updates.cv_file = '';
        }

        
        //==========================================


        // =======PROFILE PICTURE FILE MANAGEMENT

        if (req.files['profile_pic_file'] && req.files['profile_pic_file'][0]){ // Check if a file was given

            updates.profile_pic_file = req.files['profile_pic_file'][0].filename;
            console.log('SAVING', updates.profile_pic_file);

            if(old_seeker.profile_pic){
                console.log(console.log('DELETE', old_seeker.profile_pic));
                deleteUpload('uploads/' + old_seeker.profile_pic);
            }

        }
        else if (old_seeker.profile_pic){ // No file was given but previous file exists

            updates.profile_pic_file = old_seeker.profile_pic;

            if(updates.is_pic_cleared === 'true'){ // Asked to clear old file by user

                updates.profile_pic_file = '';
                console.log(console.log('DELETE', old_seeker.profile_pic));
                deleteUpload('uploads/' + old_seeker.profile_pic);

            }else{ // Maintain old file

                updates.profile_pic_file = old_seeker.profile_pic;
                console.log('KEEPING', updates.profile_pic_file);

            }
        }
        else{ // No file was given and no previous file exists
            updates.profile_pic_file = '';
        }
        
        //==========================================



        // TRIMMING 
        updates.bio = updates.bio.trim();

        delete updates.is_cv_cleared;
        delete updates.is_pic_cleared;  

        console.log(updates);

        
        let result = await Seeker.update(pool, req.user.id, updates);
        
        
        res.json({ success: true, cv_file: updates.cv_file, profile_pic_file: updates.profile_pic_file, message: 'Profile updated successfully' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// UPDATE EMPLOYER PROFILE FROM EDIT
router.post("/update-profile/employer", isNotAuthReq, employerUpload, validateCompanyName,
                                                                        validateCompanySize,
                                                                        validateBio,
                                                                        validateWebsite,
                                                                        validateAddress,
                                                                        validatePostcode,
                                                                        validatePhone,
                                                                        validateEmail,
                                                                        validateIndustry,
                                                                        validateFile,
                                                                        multerSizeErrorHandler,
                                                                        fileErrorHandler,
                                                                        allErrorHandler, async (req, res) => {
    

    try{

        const updates = req.body;
        const user_id = req.user.id;
        const old_employer = await Employer.getById(pool, user_id); // To delete old file paths

        // =================PROFILE PICTURE FILE MANAGEMENT

        if (req.files['profile_pic_file'] && req.files['profile_pic_file'][0]){ // Check if a file was given

            updates.profile_pic_file = req.files['profile_pic_file'][0].filename;
            console.log('SAVING', updates.profile_pic_file);

            if(old_employer.profile_pic){
                console.log(console.log('DELETE', old_employer.profile_pic));
                deleteUpload('uploads/' + old_employer.profile_pic);
            }

        }
        else if (old_employer.profile_pic){ // No file was given but previous file exists

            updates.profile_pic_file = old_employer.profile_pic;

            if(updates.is_pic_cleared === 'true'){ // Asked to clear old file by user

                updates.profile_pic_file = '';
                console.log(console.log('DELETE', old_employer.profile_pic));
                deleteUpload('uploads/' + old_employer.profile_pic);

            }else{ // Maintain old file

                updates.profile_pic_file = old_employer.profile_pic;
                console.log('KEEPING', updates.profile_pic_file);

            }
        }
        else{ // No file was given and no previous file exists
            updates.profile_pic_file = '';
        }

        //====================================================

        // TRIMMING 
        updates.bio = updates.bio.trim();

        // FIXING VARIABLE NAMES
        updates.name = updates.comp_name;
        updates.size = updates.comp_size ? updates.comp_size : null; // Makes sure we're not send string to db
        delete updates.comp_name;
        delete updates.comp_size;
        delete updates.is_pic_cleared;  

        console.log(updates);

        
        let result = await Employer.update(pool, req.user.id, updates);


        res.json({ success: true, profile_pic_file: updates.profile_pic_file, message: 'Profile updated successfully' });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error
    }                                                                     
    
});






// ----------------------------------------USER BUILDER FORM
router.get("/profile/builder", isNotAuthReq, async (req, res) => {

    if(req.user.user_type === 'seeker'){
        
        // If a seeker profile exists, redirect the user away from the builder page
        const seeker = await Seeker.getById(pool, req.user.id);
        if (seeker) {
            return res.redirect('/user/profile'); 
        }                       

        res.render("user/seeker_builder");   
    }


    if(req.user.user_type === 'employer'){

        // If a employer profile exists, redirect the user away from the builder page
        const employer = await Employer.getById(pool, req.user.id);
        if (employer) {
            return res.redirect('/user/profile'); 
        }                       

        res.render("user/employer_builder");   
    }

});



// SUBMIT POINT FOR SEEKER BUILDER
router.post("/profile/builder/seeker", isNotAuthReq, seekerUpload, validateFirstName,
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
            cv_file = req.files['cv_file'][0].filename;
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


// SUBMIT POINT FOR EMPLOYER BUILDER
router.post("/profile/builder/employer", isNotAuthReq, employerUpload, validateCompanyName,
                                                                        validateCompanySize,
                                                                        validateBio,
                                                                        validateWebsite,
                                                                        validateAddress,
                                                                        validatePostcode,
                                                                        validatePhone,
                                                                        validateEmail,
                                                                        validateIndustry,
                                                                        validateFile,
                                                                        multerSizeErrorHandler,
                                                                        fileErrorHandler,
                                                                        allErrorHandler, async (req, res) => {
    

    try{

        const user_id = req.user.id;
        let { comp_name, comp_size, bio, website, address, postcode, ct_phone, ct_email, industry} = req.body;

        
        let profile_pic_file = '';
        if (req.files['profile_pic_file'] && req.files['profile_pic_file'][0]){ // Check if a file was given
            profile_pic_file = req.files['profile_pic_file'][0].filename;
        }


        // TRIMMING 
        bio = bio.trim();
        comp_size = comp_size ? comp_size : null;


        let result = await Employer.create(pool, 
            user_id, 
            comp_name, 
            comp_size,  
            bio, 
            website, 
            profile_pic_file, 
            address, 
            postcode, 
            ct_phone, 
            ct_email, 
            industry);
        

        if(result){
            res.status(200).json({ success: true, message: 'Profile builder completed!', employer: result });
        }
        else{
            res.status(400).json({ success: false, message: 'Error in creating profile!', employer: result });
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



// FILE VALIDATION FUNCTIONS

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




module.exports = router;
