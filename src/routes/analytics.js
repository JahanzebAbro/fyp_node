const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Job = require('../models/jobModel');
const Seeker = require('../models/seekerModel');
const Employer = require('../models/employerModel');
const Benefit = require('../models/benefitModel');
const Application = require('../models/applicationModel');
const Response = require('../models/responseModel');

const { isNotAuthReq, isProfileBuilt, getUserIcon, isEmployerAuth, isSeekerAuth, findIndustryName } = require('../utils');



router.get("/", isProfileBuilt, isNotAuthReq, getUserIcon, async (req, res) => {


    const user_type = req.user.user_type;
    const user_id = req.user.id;

    if(user_type === 'seeker'){

        const applicationCount = await Seeker.getApplicationCount(pool, user_id);
        const applicationRate = await Seeker.getApplicationRate(pool, user_id);
        const applicationStatusCount = await Seeker.getApplicationStatusCount(pool, user_id);
        const savedApplyRatio = await Seeker.getSavedApplyRatio(pool, user_id);
        const favoriteIndustries = await Seeker.getFavoriteIndustries(pool, user_id);

        // De-code names
        const industryNames = favoriteIndustries.map(item => findIndustryName(item.industry));
        const industryCounts = favoriteIndustries.map(item => item.count);
        
        const industryRankings = [industryNames, industryCounts];

        

        res.render('analytics/analytics_seeker', { applicationCount : applicationCount, 
                                                    applicationRate : applicationRate,
                                                    applicationStatusCount : applicationStatusCount, 
                                                    savedApplyRatio : savedApplyRatio,
                                                    industryRankings : industryRankings });
    }
    if(user_type === 'employer'){

        res.render('analytics/analytics_employer');
    }

});






module.exports = router;