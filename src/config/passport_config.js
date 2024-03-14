var passport = require('passport');
var LocalStrategy = require('passport-local');
const pool = require("./db/db_config");
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

function initializePassport(passport) {

    const customFields = {
        usernameField: 'email',
        passwordField: 'pwd'
    };

    const verifyUser = async (username, password, cb) => {
        try{
            
            let user = await User.getByEmail(pool, username);

            // 1. Check if email exists in database.
            if (!user){
                return cb(null, false, {message: 'User with that email does not exist!'});
            }

            // 2. Check if password matches in database. 
            if (await bcrypt.compare(password, user.password)) {

                return done(null, user)
            } else {
                return done(null, false, {message: 'Incorrect password!'})
            }


        }
        catch(err){
            return cb(err);
        }

    };


    const strategy = new LocalStrategy(customFields, verifyUser);



    passport.use(strategy);


    passport.serializeUser((user, cb) => {
        return cb(null, user.id)
    });

    passport.deserializeUser(async (id, cb) => {
        let user = await User.getById(pool, id)
        return cb(null, user);
    });

}

module.exports = initializePassport;