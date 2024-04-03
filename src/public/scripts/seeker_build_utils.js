import { findMaxAndMinDOB } from './general_utils.js';
import { validateName, 
            validateDOB,
            validateBio,
            validateCV,
            validatePic,
            validateAddress,
            validatePostcode, 
            validatePhone,
            validateEmail} from './general_utils.js';




// ERROR BOXES
const f_name_err = $('#f_name_err');
const l_name_err = $('#l_name_err');
const d_o_b_err = $('#d_o_b_err');
const bio_err = $('#bio_err')
const address_err = $('#address_err');
const postcode_err = $('#postcode_err');
const ct_phone_err = $('#ct_phone_err');
const ct_email_err = $('#ct_email_err');
const cv_err = $('#cv_err');
const pic_err = $('#pic_err');




// ------------------Date of birth range setter
$(document).ready(function(){


    let date_picker = $('#d_o_b');
    const { max_date, min_date } = findMaxAndMinDOB();
    
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
        let bio = $('#bio').val();
        let cv = $('#cv');
        let pic = $('#profile_pic');
        let address = $('#address').val();
        let postcode = $('#postcode').val();
        let ct_phone = $('#ct_phone').val();
        let ct_email = $('#ct_email').val();

        let is_error = false;
        // If the validation turns out false then we say an is error has occured.
        if (!validateName(first_name, f_name_err)) is_error = true;
        if (!validateName(last_name, l_name_err)) is_error = true;
        if (!validateDOB(d_o_b, d_o_b_err)) is_error = true;
        if (!validateBio(bio, bio_err)) is_error = true;
        if (!validateCV(cv, cv_err)) is_error = true;
        if (!validatePic(pic, pic_err)) is_error = true;
        if (!validateAddress(address, address_err)) is_error = true;
        if (!validatePostcode(postcode, postcode_err)) is_error = true;
        if (!validatePhone(ct_phone, ct_phone_err)) is_error = true;
        if (!validateEmail(ct_email, ct_email_err)) is_error = true;       


        if (is_error){ e.preventDefault();} // Prevent submission

    });

});

