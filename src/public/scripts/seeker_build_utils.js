import { findMinAndMaxDOB } from './general_utils.js';


// DOB Valid Range Setter
$(document).ready(function(){

    let date_picker = $('#d_o_b');
    const { min_date, max_date } = findMinAndMaxDOB();
    
    date_picker.attr('min', min_date);
    date_picker.attr('max', max_date);

});




// Form submission 
$(document).ready(function(){

    $("#seeker_builder_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        
        const form = new FormData(this);
        for (let [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
            if (value instanceof File) {
                console.log(value); // Check if the file size is greater than 0
            }
        }

        // Clear previous error messages
        $('#f_name_err').text('');
        $('#l_name_err').text('');
        $('#d_o_b_err').text('');
        $('#bio_err').text('');
        $('#address_err').text('');
        $('#ct_email_err').text('');
        $('#ct_phone_err').text('');
        $('#postcode_err').text('');
        $('#gender_err').text('');
        $('#industry_err').text('');
        $('#work_status_err').text('');
        $('#cv_err').text('');
        $('#pic_err').text('');



        $.ajax({
            url: "/user/profile/builder/seeker",
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response.message);
                window.location.href = "/user/profile"; // Redirect the user
            },
            error: function(response) {

                console.log(response);

                // Display errors
                if (response.responseJSON.errors && Object.keys(response.responseJSON.errors).length > 0){
                const errors = response.responseJSON.errors; 
                    if (errors) {

                        $('#f_name_err').text(errors.f_name || '');
                        $('#l_name_err').text(errors.l_name || '');
                        $('#d_o_b_err').text(errors.d_o_b || '');
                        $('#bio_err').text(errors.bio || '');
                        $('#address_err').text(errors.address || '');
                        $('#ct_email_err').text(errors.ct_email || '');
                        $('#ct_phone_err').text(errors.ct_phone || '');
                        $('#postcode_err').text(errors.postcode || '');
                        $('#gender_err').text(errors.gender || '');
                        $('#industry_err').text(errors.industry || '');
                        $('#work_status_err').text(errors.work_status || '');
                        $('#cv_err').text(errors.cv_file || '');
                        $('#pic_err').text(errors.profile_pic_file || '');

                    }
                }
            }
        
        });

    });

});

