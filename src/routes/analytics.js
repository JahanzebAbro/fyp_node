const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Job = require('../models/jobModel');
const Seeker = require('../models/seekerModel');
const Employer = require('../models/employerModel');
const Benefit = require('../models/benefitModel');
const Application = require('../models/applicationModel');
const Response = require('../models/responseModel');

const { isNotAuthReq, 
        isProfileBuilt, 
        getUserIcon, 
        isEmployerAuth, 
        isSeekerAuth, 
        findIndustryName, 
        formatDateForDisplay } = require('../utils');



router.get("/", isProfileBuilt, isNotAuthReq, getUserIcon, async (req, res) => {


    const user_type = req.user.user_type;
    const user_id = req.user.id;

    if(user_type === 'seeker'){

        const applicationCount = await Seeker.getApplicationCount(pool, user_id);
        const applicationRate = await Seeker.getApplicationRate(pool, user_id);
        const applicationStatusCount = await Seeker.getApplicationStatusCount(pool, user_id);
        const savedApplyRatio = await Seeker.getSavedApplyRatio(pool, user_id);
        const favoriteIndustries = await Seeker.getFavoriteIndustries(pool, user_id);
        const jobViews = await Seeker.getViews(pool, user_id);


        // De-code names
        const industryNames = favoriteIndustries.map(item => findIndustryName(item.industry));
        const industryCounts = favoriteIndustries.map(item => item.count);
        
        const industryRankings = [industryNames, industryCounts];

        

        res.render('analytics/analytics_seeker', { applicationCount : applicationCount, 
                                                    applicationRate : applicationRate,
                                                    applicationStatusCount : applicationStatusCount, 
                                                    savedApplyRatio : savedApplyRatio,
                                                    industryRankings : industryRankings,
                                                    jobViews : jobViews 
                                                });
    }
    if(user_type === 'employer'){

        const jobCount = await Employer.getJobCount(pool, user_id);
        const jobSavedCount = await Employer.getSavedJobCount(pool, user_id);
        const applicationCount = await Employer.getApplicationCount(pool, user_id);
        const applicationRate = await Employer.getApplicationRate(pool, user_id);
        const acceptedCount = await Employer.getAcceptedCount(pool, user_id);
        const jobViews = await Employer.getViews(pool, user_id);
        const mostApplications = await Employer.getMostApplications(pool, user_id);
        const leastApplications = await Employer.getLeastApplications(pool, user_id);
        const mostViews = await Employer.getMostViews(pool, user_id);
        const leastViews = await Employer.getLeastViews(pool, user_id);
        const mostStarts = await Employer.getMostStarts(pool, user_id);
        const leastStarts = await Employer.getLeastStarts(pool, user_id);

        // Format Dates
        mostApplications.created_at = formatDateForDisplay(mostApplications.created_at);
        leastApplications.created_at = formatDateForDisplay(leastApplications.created_at);
        mostViews.created_at = formatDateForDisplay(mostViews.created_at);
        leastViews.created_at = formatDateForDisplay(leastViews.created_at);
        mostStarts.created_at = formatDateForDisplay(mostStarts.created_at);
        leastStarts.created_at = formatDateForDisplay(leastStarts.created_at);

        res.render('analytics/analytics_employer', { jobCount: jobCount,
                                                        jobSavedCount: jobSavedCount,
                                                        applicationCount: applicationCount,
                                                        applicationRate: applicationRate,
                                                        acceptedCount: acceptedCount,
                                                        jobViews: jobViews,
                                                        mostApplications: mostApplications,
                                                        leastApplications: leastApplications,
                                                        mostViews: mostViews,
                                                        leastViews: leastViews,
                                                        mostStarts: mostStarts,
                                                        leastStarts: leastStarts
                                                    });
    }

});






module.exports = router;