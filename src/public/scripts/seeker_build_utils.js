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

const address_regex = /^[a-zA-Z0-9\s,.'-]{3,150}$/; 


// ERROR BOXES
const f_name_err = $('#f_name_err');
const l_name_err = $('#l_name_err');
const d_o_b_err = $('#d_o_b_err');
const address_err = $('#address_err');
const postcode_err = $('#postcode_err');
const ct_phone_err = $('#ct_phone_err');
const cv_err = $('#cv_err');
const pic_err = $('#pic_err');




// ------------------Date of birth range setter
$(document).ready(function(){


    let date_picker = $('#d_o_b');
    let curr_date = new Date();
    
    // Setting max date to 18 years and min date to 100 years ago from today.
    let max_date = new Date(curr_date.getFullYear() - 18, curr_date.getMonth(), curr_date.getDate());
    let min_date = new Date(curr_date.getFullYear() - 100, curr_date.getMonth(), curr_date.getDate());
    
    //splits the ISO string at the 'T' character, separating the date part from the time part.
    max_date = max_date.toISOString().split('T')[0]; 
    min_date = min_date.toISOString().split('T')[0]; 
    
    
    date_picker.attr('max', max_date);
    date_picker.attr('min', min_date);

});




// Max char limit for name reached
$(document).ready(function(){
    
    // Display error when max char limit reached.
    $('#f_name, #l_name').on('input', function() {

        let first_name = $('#f_name').val();
        let last_name = $('#l_name').val();
        
        if (first_name.length > 49) {
            f_name_err.text("First name must be 50 characters or less");
        } 
        else if(last_name.length > 49){
            l_name_err.text("Last name must be 50 characters or less");
        }
        else {
            f_name_err.text("");
            l_name_err.text("");
        }
    });


});



// Form submission 
$(document).ready(function(){

    $("#seeker_builder_form").submit(function(e){
        

        let first_name = $('#f_name').val();
        let last_name = $('#l_name').val();
        let d_o_b = $('#d_o_b').val();
        let cv = $('#cv');
        let pic = $('#profile_pic');
        let address = $('#address').val();
        let postcode = $('#postcode').val();
        let ct_phone = $('#ct_phone').val();

        validateName(e, first_name, f_name_err); 
        validateName(e, last_name, l_name_err);
        validateDOB(e, d_o_b, d_o_b_err); 
        validateCV(e, cv, cv_err);
        validatePic(e, pic, pic_err);
        validateAddress(e, address, address_err);
        validatePostcode(e, postcode, postcode_err); 
        validatePhone(e, ct_phone, ct_phone_err);

          

    });

});




function validateName(event, name, err_box){

    if(name == '' || name == null){
        err_box.text("You must enter at least a name to build a profile.");
        event.preventDefault(); // Prevent form submission
        return false;
    }

    if(name.length < 2){
        err_box.text("Your name must have at least 2 characters.");
        event.preventDefault(); // Prevent form submission
        return false;
    }

    if (!name_regex.test(name)) {
        err_box.text("Please enter a valid name! Make sure there are no special characters or numbers.");
        
        event.preventDefault(); // Prevent form submission
        return false;
    } 
    else {
        err_box.text("");
        return true;        
    }   

}


function validateDOB(event, d_o_b, err_box){
    if(d_o_b == '' || d_o_b == null){
        err_box.text("You must enter a date of birth.");
        event.preventDefault(); // Prevent form submission
        return false;
    }
}


function validateAddress(event, address, err_box){

    // Only check if address is given
    if (address.trim() !== '') {
        
        if (address.length > 150) {
            err_box.text('Address cannot exceed 150 characters.'); 
            event.preventDefault(); 
            return false; 
        }

        if (!address_regex.test(address)) {
            err_box.text('Please enter a valid address.'); 
            event.preventDefault(); 
            return false; 
        }
    }
    else{
        err_box.text('');
        return true;
    }
}


function validatePostcode(event, postcode, err_box){
    
    if(postcode == '' || postcode == null){
        return true; // Not a compulsory value.
    }

    if (!postcode_regex.test(postcode)) {
        err_box.text("Please enter a valid postcode! We only allow UK postcodes currently.");
        
        event.preventDefault(); // Prevent form submission
        return false;
    } 
    else {
        err_box.text("");
        return true;        
    }   
}


function validatePhone(event, phone, err_box){

    if(phone == '' || phone == null){
        return true; // Not a compulsory value.
    }

    if (!phone_regex.test(phone)) {
        err_box.text("Please enter a valid phone number!");

        event.preventDefault(); // Prevent form submission
        return false;
    } 
    else {
        err_box.text("");
        return true;        
    }   
}


function validatePic(event, image, err_box){
    
        let image_file = image.get(0).files[0];
        const max_size = 2 * 1024 * 1024; // 2MB in bytes

        if (image_file && image_file.size > max_size) {

            err_box.text('Image is too large. Please upload an image smaller than 2MB.');
            event.preventDefault();
            return false;
        } else {
            err_box.text('');
            return true;
        }
    
}


function validateCV(event, cv, err_box){
    
    let cv_file = cv.get(0).files[0];
    const max_size = 2 * 1024 * 1024; // 2MB in bytes

    if (cv_file && cv_file.size > max_size) {

        err_box.text('CV file is too large. Please upload a file smaller than 2MB.');
        event.preventDefault();
        return false;
    } else {
        err_box.text('');
        return true;
    }

}