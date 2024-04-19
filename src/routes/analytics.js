const express = require("express");
const router = express.Router();
const pool = require("../config/db/db_config");
const Job = require('../models/jobModel');
const Seeker = require('../models/seekerModel');
const Employer = require('../models/employerModel');
const Benefit = require('../models/benefitModel');
const Application = require('../models/applicationModel');
const Response = require('../models/responseModel');

const { isNotAuthReq, isProfileBuilt, getUserIcon, isEmployerAuth, isSeekerAuth } = require('../utils');



router.get("/", isProfileBuilt, isNotAuthReq, getUserIcon, async (req, res) => {



    res.render('analytics/analytics_employer');

});








module.exports = router;