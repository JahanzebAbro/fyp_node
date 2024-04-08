const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const multer = require('multer');
const upload = multer(); // To help parse form in req.body
const Job = require('../models/jobModel');
const Benefit = require('../models/benefitModel');
const { isNotAuthReq, getUserIcon, allErrorHandler} = require('../utils');
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

        // Bare mimimum gets sent:
        // job_title: 'fasdfa',
        // openings: '4',
        // job_type: [ '2' ],
        // job_style: 'In-person',
        // description: 'sdfa',
        // address: '',
        // postcode: '',
        // start_date: '',
        // min_pay: '',
        // max_pay: '',
        // cv_req: 'false',
        // deadline: '',
        // status: 'open',
        // benefits: null,
        // custom_benefits: null,
        // questions: null,
        // response_types: null,
        // question_reqs: null,
        // skills: null

        // TRIMMING
        

        res.send('GOT THE DATA');
    }
        
});



module.exports = router;