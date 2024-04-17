const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const multer = require('multer');
const upload = multer(); // To help parse form in req.body
const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
const Seeker = require('../models/seekerModel');
const Benefit = require('../models/benefitModel');
const Application = require('../models/applicationModel');
const Response = require('../models/responseModel');
const { isProfileBuilt, 
        isNotAuthReq, 
        getUserIcon, 
        allErrorHandler, 
        formatDateForDisplay, 
        isEmployerAuth, 
        isSeekerAuth, 
        formatDateForEdit, 
        findIndustryName,
        cleanCVName } = require('../utils');
const { validateJobStatus,
        validateJobTitle,
        validateOpenings,
        validateJobType,
        validateJobStyle,
        validateDescription,
        validatePay,
        validateStartDate,
        validateDeadline,
        validateBenefits,
        validateCustomBenefits,
        validateQuestions,
        validateSkills,
        validateCVReq } = require('../validate_job');
const { validateAddress,
        validatePostcode,
        validateEmail } = require('../validate_utils');
const { validateAttachCV,
        validateResponses } = require('../validate_application');


// JOB SEARCH
router.get("/search", isProfileBuilt, isNotAuthReq, isSeekerAuth, getUserIcon, async (req, res) => {
    
    try{

        const seeker_id = req.user.id;

        const search_query = req.query.search;

        const all_jobs = await Job.getAllForView(pool, search_query);

        const postings = await Promise.all(all_jobs.map(async function(job){ 

            const job_id = job.id;
            const employer_id = job.user_id;

            const [employer, job_types, job_benefits, job_skills, job_questions, has_applied] = await Promise.all([ // Grabbing job details
                Employer.getById(pool, employer_id),
                Job.getTypesByJob(pool, job_id),
                Job.getBenefitsByJob(pool, job_id),
                Job.getSkillsByJob(pool, job_id),
                Job.getQuestionsByJob(pool, job_id),
                Application.hasApplied(pool, seeker_id, job_id)
            ]);

            // Formatting dates
            job.created_at = job.created_at ? formatDateForDisplay(job.created_at) : job.created_at;
            job.start_date = job.start_date ? formatDateForDisplay(job.start_date) : job.start_date;
            job.deadline = job.deadline ? formatDateForDisplay(job.deadline): job.deadline;

            // Format industry
            employer.industry = employer.industry ? findIndustryName(employer.industry) : employer.industry;
 

            return {
                ...job,
                employer,
                job_types,
                job_benefits,
                job_skills,
                job_questions,
                has_applied
            }; // return an array value of a complete combined job object

        }));

        res.render("job/job_search", { postings: postings });

            
    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }


});


// JOB EMPLOYER INFO
router.get("/employer/:user_id", isNotAuthReq, isSeekerAuth, getUserIcon, async (req, res) => {
    
    try{

        const user_id = req.params.user_id;
        const employer = await Employer.getById(pool, user_id);
        
        employer.industry = employer.industry ? findIndustryName(employer.industry) : employer.industry;

        res.render("job/employer_view", { profile: employer });

            
    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }


});


// JOB POSTINGS
router.get("/postings", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {

        
    const user_id = req.user.id;

    
    try{

        const user_jobs = await Job.getJobsByUser(pool, user_id);
        const employer = await Employer.getById(pool, user_id);

        const postings = await Promise.all(user_jobs.map(async function(job){ 

            const job_id = job.id;

            const [job_types, job_benefits, job_skills] = await Promise.all([ // Grabbing job details
                Job.getTypesByJob(pool, job_id),
                Job.getBenefitsByJob(pool, job_id),
                Job.getSkillsByJob(pool, job_id),
            ]);

            // Formatting dates
            job.created_at = job.created_at ? formatDateForDisplay(job.created_at) : job.created_at;
            job.start_date = job.start_date ? formatDateForDisplay(job.start_date) : job.start_date;
            job.deadline = job.deadline ? formatDateForDisplay(job.deadline): job.deadline;

            return {
                ...job,
                employer,
                job_types,
                job_benefits,
                job_skills
            }; // return an array value of a complete combined job object

        }));

        res.render("job/postings", { postings: postings });

            
    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }


});


// VIEW JOB POST
router.get("/postings/:job_id", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {


    try{

        const user_id = req.user.id;
        const job_id =  req.params.job_id;

        const job = await Job.getById(pool, job_id);


        if(user_id.toString() !== job.user_id){ // If the job doesnt match with the current user id.
            res.status(401).render("401", { url: req.originalUrl });
        }

    
        const [job_types, job_benefits, job_questions, job_skills] = await Promise.all([ // Grabbing job details
            Job.getTypesByJob(pool, job_id),
            Job.getBenefitsByJob(pool, job_id),
            Job.getQuestionsByJob(pool, job_id),
            Job.getSkillsByJob(pool, job_id),
        ]);

        // Formatting dates
        job.created_at = job.created_at ? formatDateForDisplay(job.created_at) : job.created_at;
        job.start_date = job.start_date ? formatDateForDisplay(job.start_date) : job.start_date;
        job.deadline = job.deadline ? formatDateForDisplay(job.deadline): job.deadline;
        
        const post = {
            ...job,
            job_types,
            job_benefits, 
            job_questions,
            job_skills
        };
        
        res.render("job/post", {post: post});

    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});


// JOB POST EDIT
router.get("/postings/edit/:job_id", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {


    try{

        const user_id = req.user.id;
        const job_id =  req.params.job_id;

        const job = await Job.getById(pool, job_id);


        if(user_id.toString() !== job.user_id){ // If the job doesnt match with the current user id.
            res.status(401).render("401", { url: req.originalUrl });
        }

    
        const [job_types, job_benefits, job_questions, job_skills] = await Promise.all([ // Grabbing job details
            Job.getTypesByJob(pool, job_id),
            Job.getBenefitsByJob(pool, job_id),
            Job.getQuestionsByJob(pool, job_id),
            Job.getSkillsByJob(pool, job_id),
        ]);


        // Formatting dates
        job.start_date = job.start_date ? formatDateForEdit(job.start_date) : job.start_date;
        job.deadline = job.deadline ? formatDateForEdit(job.deadline): job.deadline;
        

        const post = {
            ...job,
            job_types,
            job_benefits, 
            job_questions,
            job_skills
        };

        const db_job_types = await Job.getAllJobTypes(pool);
        const db_benefits = await Benefit.getAll(pool);    

        // const db_benefits = await Benefit.getAllForJob(pool, job_id);    
        

        res.render("job/edit_post", {post: post, job_types: db_job_types, benefits: db_benefits});

    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});


// JOB UPDATE 
router.post("/update", isNotAuthReq, isEmployerAuth, getUserIcon, upload.none(),
                                                                validateJobTitle,
                                                                validateOpenings,
                                                                validateJobType,
                                                                validateJobStyle,
                                                                validateDescription,
                                                                validateAddress,
                                                                validatePostcode,
                                                                validateStartDate,
                                                                validatePay,
                                                                validateBenefits,
                                                                validateCustomBenefits,
                                                                validateQuestions,
                                                                validateSkills,
                                                                validateCVReq,
                                                                validateDeadline,
                                                                validateJobStatus,
                                                                allErrorHandler, async (req, res) => {
    
    try{

        
        let { 
            job_id,
            job_title, 
            openings,
            job_type, 
            job_style, 
            description, 
            address, 
            postcode, 
            start_date, 
            min_pay, 
            max_pay,
            benefits,
            custom_benefits,
            questions,
            response_types, 
            question_reqs,
            skills, 
            cv_req, 
            deadline, 
            status 
        } = req.body;
            
            
            // console.log(req.body);
            
            
            // TRIMMING AND NULLING IF EMPTY STRING
            // Certain values won't need trimming due to validation check.
            
            job_title = job_title.trim(); 
            openings = openings.trim(); 
            description = description.trim();
            address = address.trim() || null;
            postcode = postcode.trim() || null;
            min_pay = min_pay.trim() || null;
            max_pay = max_pay.trim() || null;
            start_date = start_date.trim() || null;
            benefits = benefits ? benefits.map(value => value.trim()) : []; // Map values can't work on null vals.
            custom_benefits = custom_benefits ? custom_benefits.map(value => value.trim()) : [];
            questions = questions ? questions.map(value => value.trim()) : null;
            skills = skills ? skills.map(value => value.trim()) : [];
            deadline = deadline.trim() || null;
            
            const job_fields = {
                status: status,
                title: job_title,
                openings: openings,
                description: description,
                style: job_style,
                address: address,
                postcode: postcode,
                min_pay: min_pay,
                max_pay: max_pay,
                cv_req: cv_req,
                deadline: deadline,
                start_date: start_date
            }; 

            
            // UPDATE JOB
            const job_result = await Job.update(pool, job_id, job_fields);
            
            
            // ADD JOB TYPE
            const type_result = await Job.updateTypes(pool, job_id, job_type);
            

            // UPDATE CUSTOM BENEFITS
            const custom_benefit_ids = custom_benefits ? await Benefit.updateCustom(pool, job_id, custom_benefits) : null; 
            
            
            // ADD BENEFITS 
            if(custom_benefit_ids){
                benefits = benefits.concat(custom_benefit_ids);
            }

            const benefits_result = await Job.updateBenefits(pool, job_id, benefits); 
            
            // ADD QUESTIONS, RESPONSE TYPE, AND REQ
            let questions_obj = questions ? questions.map((question, index) => ({ // Create array of question object for model create.
                question: question,
                response_type: response_types[index],
                is_req: question_reqs[index]
            })) : [];
            
            const questions_result = await Job.updateQuestions(pool, job_id, questions_obj);
            
            
            // ADD SKILL
            const skills_result = await Job.updateSkills(pool, job_id, skills);
            
            
            res.status(200).json({ success: true, message: 'Job updated!'});
            
        }
        catch(err){

            console.error(err);
            res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error
        }                                                                
});


// JOB CREATION FORM PAGE
router.get("/create", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {
    
    const job_types = await Job.getAllJobTypes(pool);
    const benefits = await Benefit.getAll(pool);

    res.render("job/job_create", {job_types : job_types, benefits: benefits});
        
});


// JOB CREATION SUBMISSION POINT 
router.post("/create", isNotAuthReq, isEmployerAuth, getUserIcon, upload.none(),
                                                                validateJobTitle,
                                                                validateOpenings,
                                                                validateJobType,
                                                                validateJobStyle,
                                                                validateDescription,
                                                                validateAddress,
                                                                validatePostcode,
                                                                validateStartDate,
                                                                validatePay,
                                                                validateBenefits,
                                                                validateCustomBenefits,
                                                                validateQuestions,
                                                                validateSkills,
                                                                validateCVReq,
                                                                validateDeadline,
                                                                validateJobStatus,
                                                                allErrorHandler, async (req, res) => {
    
    try{

        const user_id = req.user.id;
        
        let { job_title, 
            openings,
            job_type, 
            job_style, 
            description, 
            address, 
            postcode, 
            start_date, 
            min_pay, 
            max_pay,
            benefits,
            custom_benefits,
            questions,
            response_types, 
            question_reqs,
            skills, 
            cv_req, 
            deadline, 
            status } = req.body;
            
            
            console.log(req.body);
            
            
            // TRIMMING AND NULLING IF EMPTY STRING
            // Certain values won't need trimming due to validation check.
            
            job_title = job_title.trim(); 
            openings = openings.trim(); 
            description = description.trim();
            address = address.trim() || null;
            postcode = postcode.trim() || null;
            min_pay = min_pay.trim() || null;
            max_pay = max_pay.trim() || null;
            start_date = start_date.trim() || null;
            benefits = benefits ? benefits.map(value => value.trim()) : null; // Map values can't work on null vals.
            custom_benefits = custom_benefits ? custom_benefits.map(value => value.trim()) : null;
            questions = questions ? questions.map(value => value.trim()) : null;
            skills = skills ? skills.map(value => value.trim()) : null;
            deadline = deadline.trim() || null;
            
            
            // ADD JOB
            const job_id = await Job.create(
                pool,
                user_id,
                status,
                job_title,
                openings,
                description,
                job_style,
                address,
                postcode,
                min_pay,
                max_pay,
                cv_req,
                deadline,
                start_date  
            );
            
            
            // ADD JOB TYPE
            const type_result = await Job.addTypes(pool, job_id, job_type);
            
            // ADD CUSTOM BENEFITS
            const custom_benefit_ids = custom_benefits ? await Benefit.createCustom(pool, custom_benefits) : null; 
            
            
            // ADD BENEFITS 
            if(custom_benefit_ids){
                benefits = benefits.concat(custom_benefit_ids);
            }

            const benefits_result = benefits ? await Job.addBenefits(pool, job_id, benefits) : null;  
            
            
            // ADD QUESTIONS, RESPONSE TYPE, AND REQ
            let questions_obj = questions ? questions.map((question, index) => ({ // Create array of question object for model create.
                question: question,
                response_type: response_types[index],
                is_req: question_reqs[index]
            })) : null;
            
            const questions_result = questions_obj ? await Job.createQuestions(pool, job_id, questions_obj) : null;
            
            
            // ADD SKILL
            const skills_result = skills ? await Job.createSkills(pool, job_id, skills) : null;
            
            
            res.status(200).json({ success: true, message: 'Job created!'});
            
        }
        catch(err){

            console.error(err);
            res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error
        }                                                                
});
        

// JOB DELETE SUBMISSION
router.post("/delete", isNotAuthReq, isEmployerAuth, getUserIcon, upload.none(), async (req, res) => {

    try{

        const job_id = req.body.job_id;
        console.log('DELETING JOB:', job_id);
        
        const result = await Job.deleteById(pool, job_id);


        if (result){
            res.status(200).json({ success: true, message: 'Job deleted!'});
        }
        else{
            res.status(400).json({ success: false, message: 'An internal server error occurred' }); 
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: 'An internal server error occurred' }); 
    }



});


// GET APPLICATIONS FOR USER
router.get("/applications", isNotAuthReq, isSeekerAuth, getUserIcon, async (req, res) => {

    try{

        const seeker_id = req.user.id;

        const search_query = req.query.search;

        let all_applications = await Application.getBySeeker(pool, seeker_id, search_query);


        const job_applications = await Promise.all(all_applications.map(async function(application){ 

            const job_id = application.job_id;
            const job = await Job.getById(pool, job_id);
            const employer_id = job.user_id;

            const [employer, job_types, job_benefits, job_skills, job_questions, responses] = await Promise.all([ // Grabbing job details
                Employer.getById(pool, employer_id),
                Job.getTypesByJob(pool, job_id),
                Job.getBenefitsByJob(pool, job_id),
                Job.getSkillsByJob(pool, job_id),
                Job.getQuestionsByJob(pool, job_id),
                Response.getByApplication(pool, application.id)
            ]);

            // Formatting dates
            application.created_at = application.created_at ? formatDateForDisplay(application.created_at) : application.created_at;
            job.created_at = job.created_at ? formatDateForDisplay(job.created_at) : job.created_at;
            job.start_date = job.start_date ? formatDateForDisplay(job.start_date) : job.start_date;
            job.deadline = job.deadline ? formatDateForDisplay(job.deadline): job.deadline;

            // Format industry and cv for display
            employer.industry = employer.industry ? findIndustryName(employer.industry) : employer.industry;
            application.cv_display = application.cv_file ? cleanCVName(application.cv_file) : 'None';
 

            return {
                ...application,
                job,
                employer,
                job_types,
                job_benefits,
                job_skills,
                job_questions,
                responses
            }; // return an array value of a complete combined job object

        }));

        // res.send(job_applications);
        res.render("job/applications", {applications : job_applications});

    }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});



// CREATE APPLICATION
router.post("/application/create", isProfileBuilt, isNotAuthReq, isSeekerAuth, getUserIcon, upload.none(),
                                                                            validateAttachCV,
                                                                            validateEmail,
                                                                            validateResponses,
                                                                            allErrorHandler, async (req, res) => {

    try{
        
        let {job_id, ct_email, cv_req, responses, attach_cv, questions} = req.body;
        let cv_file = '';
        const seeker_id = req.user.id;
    
        if(attach_cv){
            const seeker = await Seeker.getById(pool, seeker_id);
            cv_file = seeker.cv;
        }
        
        // console.log(req.body);

        questions = JSON.parse(questions);
        const question_ids = questions.map(question => question.id); // Array of question ids 

        let application_id = null;

        if(Object.keys(req.validation_errors).length === 0){

            application_id = await Application.create(pool, seeker_id, job_id, ct_email, cv_file); 
            const responses_result = await Response.create(pool, application_id, question_ids, responses);
        }
         


        if(application_id){

            return res.json({ success: true, message: 'Application created!'});
        }

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error

    }

});


// DELETE APPLICATION
router.post("/application/delete", isNotAuthReq, isSeekerAuth, getUserIcon, upload.none(), async (req, res) => {

    try{
    
        // First need to check if seeker is deleting their own application.

        const { application_id } = req.body;

        const application = await Application.getById(pool, application_id);

        if(req.user.id == application.seeker_id){ // Checks if current user matches id of application

            const result = await Application.deleteById(pool, application_id);

            if(result){

                return res.json({ success: true, message: 'Application deleted!'});
            }
        }

        
        return res.status(400).json({ success: false, message: 'An internal server error occurred' }); 

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error

    }

});


// GET APPLICANT FOR JOB
router.get("/applicants/:job_id", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {

    try{

        // Info to send:
        // All applications for a job.
        // Seeker info for application.
        // Get questions for job
        // Get responses for application

        const job_id = req.params.job_id;
        
        let all_applications = await Application.getForJob(pool, job_id);
        const job_questions = await Job.getQuestionsByJob(pool, job_id);

        const applicants = await Promise.all(all_applications.map(async function(application){ 


            const [seeker, responses] = await Promise.all([
                Seeker.getById(pool, application.seeker_id), 
                Response.getByApplication(pool, application.id)
            ]);

            // Formatting dates
            application.created_at = application.created_at ? formatDateForDisplay(application.created_at) : application.created_at;
            application.cv_display = application.cv_file ? cleanCVName(application.cv_file) : 'None';

            return {
                application,
                seeker,
                job_questions,
                responses
            }; 

        }));

        res.render("job/applicants", {applicants: applicants});

    }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});

// VIEW APPLICANT PROFILE
router.get("/applicants/profile/:user_id", isNotAuthReq, isEmployerAuth, getUserIcon, async (req, res) => {

    try{

        const user_id = req.params.user_id;
        const seeker = await Seeker.getById(pool, user_id);
        
        seeker.industry = seeker.industry ? findIndustryName(seeker.industry) : seeker.industry;
        seeker.cv_display = seeker.cv ? cleanCVName(seeker.cv) : 'None';
    
        res.render("job/seeker_view", { profile: seeker });

            
    }
    catch(err){

        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});

// UPDATE APPLICANT STATUS
router.post("/applicants/status", isNotAuthReq, isEmployerAuth, getUserIcon, upload.none(), async (req, res) => {

    try{

        const { application_id, new_status } = req.body;

        const result = await Application.changeStatus(pool, application_id, new_status);

        if(result){
            return res.json({ success: true, message: 'Status updated!'});
        }

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'An internal server error occurred' }); // 500 means internal server error
    }


});

module.exports = router;