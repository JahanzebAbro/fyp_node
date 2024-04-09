const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const multer = require('multer');
const upload = multer(); // To help parse form in req.body
const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');
const Benefit = require('../models/benefitModel');
const { isNotAuthReq, getUserIcon, allErrorHandler, formatDateForDisplay} = require('../utils');
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
        validatePostcode } = require('../validate_utils');



router.get("/postings", isNotAuthReq, getUserIcon, async (req, res) => {
    if(req.user.user_type === 'seeker'){ // Seeker cannot create a job.
        res.status(401).render("401", { url: req.originalUrl });
    }
    else if(req.user.user_type === 'employer'){

        

        const job_id = 3;
        const user_id = req.user.id;

        
        try{
            // const job_postings = await Job.getJobsByUser(pool, user_id);

            const [employer, job, job_types, job_benefits, job_questions, job_skills] = await Promise.all([
                Employer.getById(pool, user_id),
                Job.getById(pool, job_id),
                Job.getTypesByJob(pool, job_id),
                Job.getBenefitsByJob(pool, job_id),
                Job.getQuestionsByJob(pool, job_id),
                Job.getSkillsByJob(pool, job_id),
            ]); // To allow parallel running we use Promise.all()
            

            // Formatting dates
            job.created_at = formatDateForDisplay(job.created_at);
            job.start_date = formatDateForDisplay(job.start_date);
            job.deadline = formatDateForDisplay(job.deadline);

            res.render("job/postings", { 
                employer: employer,
                job: job, 
                job_types : job_types, 
                job_benefits : job_benefits,
                job_questions : job_questions,
                job_skills: job_skills
            });
                
        }
        catch(err){

            console.error(err);
            res.status(500).send("Internal Server Error");
        }

    }
});



// JOB CREATION FORM PAGE
router.get("/create", isNotAuthReq, getUserIcon, async (req, res) => {
    
    if(req.user.user_type === 'seeker'){ // Seeker cannot create a job.
        res.status(401).render("401", { url: req.originalUrl });
    }
    else if(req.user.user_type === 'employer'){

        const job_types = await Job.getAllJobTypes(pool);
        const benefits = await Benefit.getAll(pool);

        res.render("job/job_create", {job_types : job_types, benefits: benefits});
    }
        
});


// CREATE SUBMISSION POINT 
router.post("/create", isNotAuthReq, getUserIcon, upload.none(),
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
    
    if(req.user.user_type === 'seeker'){ // Seeker cannot create a job.
        res.status(401).render("401", { url: req.originalUrl });
    }
    else if(req.user.user_type === 'employer'){

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
                                    );

        
        // ADD JOB TYPE
        const type_result = await Job.addTypes(pool, job_id, job_type);
        
        // ADD CUSTOM BENEFITS
        const custom_benefit_ids = custom_benefits ? await Benefit.createCustom(pool, custom_benefits) : null; 


        // ADD BENEFITS 
        const benefits_result = benefits ? await Job.addBenefits(pool, job_id, benefits) : null;  
        const custom_benefits_result = custom_benefits ? await Job.addBenefits(pool, job_id, custom_benefit_ids) : null;                        


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
        
});



module.exports = router;