const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Job = require('../models/jobModel');
const Benefit = require('../models/benefitModel');
const { isNotAuthReq, getUserIcon} = require('../utils');
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
router.post("/create", isNotAuthReq, getUserIcon, validateJobTitle,
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
                                                    validateJobStatus, async (req, res) => {
    
    if(req.user.user_type === 'seeker'){ // Seeker cannot create a job.
        res.status(401).render("401", { url: req.originalUrl });
    }
    else if(req.user.user_type === 'employer'){

        let job_data = req.body;
        //Default data sent:
        // 1. job_title
        // 2. openings
        // 3. job_style
        // 4. description
        // 5. address
        // 6. postcode
        // 7. start_date
        // 8. min_pay
        // 9. max_pay
        // 10. cv_req
        // 11. deadline
        // 12. status
        
        // Missing: for job
        // const user_id = req.user.id;
    
        // To re-arrange:
        // if(req.body.job_type)
        // if(req.body.benefits)
        // if(req.body.custom_benefits)
        // if(req.body.questions)
        // if(req.body.response_types)
        // if(req.body.question_reqs_x)
        // if(req.body.skills)

        // TRIMMING
        
        console.log(req.validation_errors);

        res.send(job_data);
    }
        
});



module.exports = router;