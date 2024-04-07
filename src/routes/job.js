const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Job = require('../models/jobModel');
const Benefit = require('../models/benefitModel');
const { isNotAuthReq, getUserIcon} = require('../utils');




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



module.exports = router;