// Check to see if user is logged in by checking session passport.
function isNotAuthReq(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(401).render("401", { url: req.originalUrl });
    }
}

// To redirect logged in users away from login and register page.
function isAuthReq(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("user/dashboard");
    }
    
    next();
    
}


module.exports = {
    isNotAuthReq: isNotAuthReq,
    isAuthReq: isAuthReq
};