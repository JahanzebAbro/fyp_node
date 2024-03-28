const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

// Make sure password is valid and equal to confirmed password. Returns error string if not.
function newPasswordAuth(pwd, cf_pwd){

    // Check to see if confirmed password is equal to password.
    if (pwd != cf_pwd){
        return "Passwords do not match!";
    }

    regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    
    // Check against password against regex, and find missing requirement(s)
    if (!regex.test(pwd)) {
        let regex_err = "Password must meet the following requirements:\n";
    
        if (!/(?=.*\d)/.test(pwd)) {
            regex_err += "- At least one digit.\n";
        }
    
        if (!/(?=.*[A-Z])/.test(pwd)) {
            regex_err += "- At least one uppercase letter.\n";
        }
    
        if (!/(?=.*[a-z])/.test(pwd)) {
            regex_err += "- At least one lowercase letter.\n";
        }
    
        if (!/(?=.*[^\w\d\s:])/.test(pwd)) {
            regex_err += "- At least one special character.\n";
        }
    
        if (pwd.length < 8 || pwd.length > 32) {
            regex_err += "- Password length should be between 8 and 32 characters.\n";
        }
    
        return regex_err;
    }
    
    // All checks cleared
    return null;
    
    
}

function togglePasswordVisibility(){
    let x = document.getElementById("pwd");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

module.exports = {
    hashPassword: hashPassword,
    newPasswordAuth: newPasswordAuth
};