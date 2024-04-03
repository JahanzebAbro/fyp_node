// Reference: https://a-tokyo.medium.com/first-and-last-name-validation-for-forms-and-databases-d3edf29ad29d
const name_regex = 
/^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+([ \-']{0,1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+){0,2}[.]{0,1}$/;

// Reference: https://ideal-postcodes.co.uk/guides/postcode-validation
// This only allows UK postcodes
const postcode_regex = 
/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i; 

// Reference: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
const phone_regex = 
/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

// Reference: https://emailregex.com/
const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const bio_regex = /^[a-zA-Z0-9 .,!?;:'"“”‘’\-_\n]+$/;
const address_regex = /^[a-zA-Z0-9\s,.'-]{3,150}$/; 


export function findMaxAndMinDOB(){
    let curr_date = new Date();
    
    // Setting max date to 18 years and min date to 100 years ago from today.
    let max_date = new Date(curr_date.getFullYear() - 18, curr_date.getMonth(), curr_date.getDate());
    let min_date = new Date(curr_date.getFullYear() - 100, curr_date.getMonth(), curr_date.getDate());
    
    //splits the ISO string at the 'T' character, separating the date part from the time part.
    max_date = max_date.toISOString().split('T')[0]; 
    min_date = min_date.toISOString().split('T')[0]; 

    return { max_date, min_date };
}


export function findIndustryCode(industry_name){
    const industries = {
        "": "None", 
        "IT": "Information Technology",
        "MED": "Medicine",
        "ECMM": "Ecommerce",
        "CAR": "Car Dealership",
        "FIN": "Finance",
        "EDU": "Education",
        "MAN": "Manufacturing",
        "TRA": "Transportation",
        "HOS": "Hospitality",
        "ART": "Art and Design",
        "ENT": "Entertainment",
        "AGR": "Agriculture",
        "CON": "Construction",
        "PHA": "Pharmaceuticals",
        "TEL": "Telecommunications",
        "RST": "Restaurant",
        "COS": "Cosmetics",
        "FIT": "Fitness",
        "TRV": "Travel",
        "ADV": "Advertising"
    };


    for (const [code, name] of Object.entries(industries)) {
        if (name === industry_name) {
            return code;
        }
    }

    return "Industry Code not found";
}


export function findIndustryName(code){
    const industries = {
        "": "None", 
        "IT": "Information Technology",
        "MED": "Medicine",
        "ECMM": "Ecommerce",
        "CAR": "Car Dealership",
        "FIN": "Finance",
        "EDU": "Education",
        "MAN": "Manufacturing",
        "TRA": "Transportation",
        "HOS": "Hospitality",
        "ART": "Art and Design",
        "ENT": "Entertainment",
        "AGR": "Agriculture",
        "CON": "Construction",
        "PHA": "Pharmaceuticals",
        "TEL": "Telecommunications",
        "RST": "Restaurant",
        "COS": "Cosmetics",
        "FIT": "Fitness",
        "TRV": "Travel",
        "ADV": "Advertising"
    };

    const industry = industries[code] || "Industry not found";

    return industry;
}


export function validateName(name, err_box){

    if(name == '' || name == null){
        err_box.text("You must enter at least a name to build a profile.");
        return false;
    }

    if(name.length < 2){
        err_box.text("Your name must have at least 2 characters.");
        return false;
    }

    if (!name_regex.test(name)) {
        err_box.text("Please enter a valid name! Make sure there are no special characters or numbers.");
        
        return false;
    } 
    else {
        err_box.text("");
        return true;        
    }   

}


export function validateDOB(d_o_b, err_box){
    if(d_o_b == '' || d_o_b == null){
        err_box.text("You must enter a date of birth.");
        return false;
    }
    else {
        err_box.text("");
        return true;        
    } 
}


export function validateBio(bio, err_box){
    // Only check if address is given
    if (bio.trim() !== '') {
            
        if (bio.length > 800) {
            err_box.text('Bio cannot exceed 800 characters.'); 
            return false; 
        }

        if (!bio_regex.test(bio)) {
            err_box.text('Contains invalid characters.'); 
            return false; 
        }

        err_box.text('');
        return true;
    }
    else{
        err_box.text('');
        return true;
    }
}


export function validateAddress(address, err_box){

    err_box.text('');
    // Only check if address is given
    if (address.trim() !== '') {
        
        if (address.length > 150) {
            err_box.text('Address cannot exceed 150 characters.'); 
            return false; 
        }

        if (!address_regex.test(address)) {
            err_box.text('Please enter a valid address.'); 
            return false; 
        }

        return true;        
    }
    else{
        return true;
    }
}


export function validatePostcode(postcode, err_box){
    
    err_box.text("");

    if(postcode === '' || postcode === null){
        return true; // Not a compulsory value.
    }
    else{
        if (!postcode_regex.test(postcode)) {

            err_box.text("Please enter a valid postcode! We only allow UK postcodes currently.");
            return false;
        } 
            
        return true;        
    } 
}


export function validatePhone(phone, err_box){

    if(phone == '' || phone == null){
        return true; // Not a compulsory value.
    }

    if (!phone_regex.test(phone)) {
        err_box.text("Please enter a valid phone number!");

        return false;
    } 
    else {
        err_box.text("");
        return true;        
    }   
}


export function validateEmail(email, err_box){
    
    err_box.text("");

    if(email == '' || email == null){
        return true; // Not a compulsory value.
    }
    else{
        if (!email_regex.test(email)) {
            err_box.text("Please enter a valid email!");

            return false;
        } 
        
        return true;
    }   
}


export function validatePic(image, err_box){
    
        let image_file = image.get(0).files[0];
        const max_size = 2 * 1024 * 1024; // 2MB in bytes

        if (image_file && image_file.size > max_size) {

            err_box.text('Image is too large. Please upload an image smaller than 2MB.');
            return false;
        } else {
            err_box.text('');
            return true;
        }
    
}


export function validateCV(cv, err_box){
    
    let cv_file = cv.get(0).files[0];
    const max_size = 2 * 1024 * 1024; // 2MB in bytes

    if (cv_file && cv_file.size > max_size) {

        err_box.text('CV file is too large. Please upload a file smaller than 2MB.');
        return false;
    } else {
        err_box.text('');
        return true;
    }

}