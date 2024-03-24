// Check to see if user is logged in by checking session passport.
function isAuthReq(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(401).render("401", { url: req.originalUrl });
    }
}


module.exports = {
    isAuthReq: isAuthReq
};