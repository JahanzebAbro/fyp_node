import { findMaxAndMinDOB, findIndustryCode, findIndustryName } from './general_utils.js';


// Storing values for edit mode
let f_name_old_val = $('#f_name_val').text().trim();
let l_name_old_val = $('#l_name_val').text().trim();
let gender_old_val = $('#gender_val').text().trim();
let d_o_b_old_val = $('#d_o_b_val').text().trim();
let bio_old_val = $('#bio_val').text().trim();
let address_old_val = $('#address_val').text().trim();
let postcode_old_val = $('#postcode_val').text().trim();
let ct_phone_old_val = $('#ct_phone_val').text().trim();
let ct_email_old_val = $('#ct_email_val').text().trim();
let industry_old_val = $('#industry_val').text().trim();
let work_status_old_val = $('#work_status_val').text().trim();


// EDIT BUTTON
$(document).ready(function(){
    $('#edit-profile-btn').click(function() {
        toggleEditMode(true);
    });
});


// SAVE EDIT BUTTON
$(document).ready(function(){
    $('#save-edit-btn').click(function() {

    
        const profile = {
            f_name: $('input[name="f_name"]').val(),
            l_name: $('input[name="l_name"]').val(),
            gender: $('select[name="gender"]').val(),
            d_o_b: $('input[name="d_o_b"]').val().trim(),
            bio: $('textarea[name="bio"]').val(),
            address: $('input[name="address"]').val(),
            postcode: $('input[name="postcode"]').val(),
            ct_phone: $('input[name="ct_phone"]').val(),
            ct_email: $('input[name="ct_email"]').val(),
            industry: $('select[name="industry"]').val(),
            work_status: $('input[name="work_status"]:checked').val() === "true"
        };
    
        // Sending to endpoint to update database.
        $.ajax({
            url: '/user/update-profile', 
            type: 'POST',
            data: profile,
            success: function(response) {
                if(response.success) {
                    console.log(response.message);
                    toggleEditMode(false, true); // Turn off edit mode and fix input values into display
                } else {
                    console.log(response.message);
                }
            },
            error: function(xhr, status, err) {
            }
        });

        
    });
});


// CANCEL EDIT BUTTON
$(document).ready(function(){
    $('#cancel-edit-btn').click(function() {
        toggleEditMode(false);
    });
});



function toggleEditMode(isEditMode, isSaved=false){


    if(isEditMode){

        // -----------UPDATE FORM
        // FIRST NAME
        $('#f_name_val').html(`<input type="text" name="f_name" maxlength="50" value="${f_name_old_val}">`);

        // LAST NAME
        $('#l_name_val').html(`<input type="text" name="l_name" maxlength="50" value="${l_name_old_val}">`);

        // GENDER
        $('#gender_val').html(`<select name="gender">
                                    <option value="">Select a gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>`);
        $('select[name="gender"]').val(gender_old_val); // Pre-selecting option based on old value.

        // DATE OF BIRTH
        const dob_parts = d_o_b_old_val.split('/'); // Cutting up dd/mm/yyyy so we can pass into yyyy/mm/dd for date picker.
        const { max_date, min_date } = findMaxAndMinDOB(); // Between 100 years and 18 years ago.

        $('#d_o_b_val').html(`<input type="date" name="d_o_b" 
                                value="${dob_parts[2]}-${dob_parts[1]}-${dob_parts[0]}"}
                                min="${min_date}" max="${max_date}" ">`);
        
        // BIOGRAPHY
        $('#bio_val').html(`<br><textarea name="bio" rows="4" cols="50" maxlength="800" 
            placeholder="Let others know more about YOU with a short description of what you're all about!">${bio_old_val}</textarea>`);


        // ADDRESS
        $('#address_val').html(`<input type="text" name="address" value="${address_old_val}">`);

        // POSTCODE
        $('#postcode_val').html(`<input type="text" name="postcode" value="${postcode_old_val}">`);

        // CONTACT PHONE
        $('#ct_phone_val').html(`<input type="text" name="ct_phone" value="${ct_phone_old_val}">`);

        // CONTACT EMAIL
        $('#ct_email_val').html(`<input type="text" name="ct_email" value="${ct_email_old_val}">`);

        // INDUSTRY
        $('#industry_val').html(`<select name="industry">
                                        <option value="">None</option>
                                        <option value="IT">Information Technology</option>
                                        <option value="MED">Medicine</option>
                                        <option value="ECMM">Ecommerce</option>
                                        <option value="CAR">Car Dealership</option>
                                        <option value="FIN">Finance</option>
                                        <option value="EDU">Education</option>
                                        <option value="MAN">Manufacturing</option>
                                        <option value="TRA">Transportation</option>
                                        <option value="HOS">Hospitality</option>
                                        <option value="ART">Art and Design</option>
                                        <option value="ENT">Entertainment</option>
                                        <option value="AGR">Agriculture</option>
                                        <option value="CON">Construction</option>
                                        <option value="PHA">Pharmaceuticals</option>
                                        <option value="TEL">Telecommunications</option>
                                        <option value="RST">Restaurant</option>
                                        <option value="COS">Cosmetics</option>
                                        <option value="FIT">Fitness</option>
                                        <option value="TRV">Travel</option>
                                        <option value="ADV">Advertising</option>
                                    </select>`);
        $('select[name="industry"]').val(findIndustryCode(industry_old_val)); // Pre-selecting option based on old value.
        
        // WORK STATUS
        $('#work_status_val').html(`<label>
                                        <input type="radio" name="work_status" value="true" 
                                        ${work_status_old_val === 'Ready to Work' ? 'checked' : ''}>
                                        Ready to Work
                                    </label>
                                    <label>
                                        <input type="radio" name="work_status" value="false" 
                                        ${work_status_old_val === 'Not Ready to Work' ? 'checked' : ''}>
                                        Not Ready to Work
                                    </label>`);



        // Button displays
        $('#edit-profile-btn').hide();
        $('#save-edit-btn').show();
        $('#cancel-edit-btn').show();



    }
    else{

        if(isSaved){

            // VALIDATE


            // AJAX - UPDATE DATABASE

            // CONFIGURE AND DISPLAY NEW VALUES
            f_name_old_val = $('input[name="f_name"]').val();
            $('#f_name_val').text(f_name_old_val || 'None');

            l_name_old_val = $('input[name="l_name"]').val();
            $('#l_name_val').text(l_name_old_val || 'None');
            
            gender_old_val = $('select[name="gender"]').val();
            $('#gender_val').text(gender_old_val || 'None');

            const parts =  $('input[name="d_o_b"]').val().trim().split('-'); // split into yyyy, mm, dd
            d_o_b_old_val = `${parts[2]}/${parts[1]}/${parts[0]}`;
            $('#d_o_b_val').text(d_o_b_old_val || 'None');
            
            bio_old_val = $('textarea[name="bio"]').val();
            $('#bio_val').text(bio_old_val || 'None');
            
            address_old_val = $('input[name="address"]').val();
            $('#address_val').text(address_old_val || 'None');

            postcode_old_val = $('input[name="postcode"]').val();
            $('#postcode_val').text(postcode_old_val || 'None');

            ct_phone_old_val = $('input[name="ct_phone"]').val();
            $('#ct_phone_val').text(ct_phone_old_val || 'None');

            ct_email_old_val = $('input[name="ct_email"]').val();
            $('#ct_email_val').text(ct_email_old_val || 'None');

            industry_old_val = findIndustryName($('select[name="industry"]').val());
            $('#industry_val').text(industry_old_val || 'None');

            work_status_old_val = $('input[name="work_status"]:checked').val() === "true" ? 'Ready to Work' : 'Not Ready to Work';
            $('#work_status_val').text(work_status_old_val);
                                              
        }
        else{

            // Convert input fields back to text with old values.
            $('#f_name_val').text(f_name_old_val);
            $('#l_name_val').text(l_name_old_val);
            $('#gender_val').text(gender_old_val);
            $('#d_o_b_val').text(d_o_b_old_val);
            $('#bio_val').text(bio_old_val);
            $('#address_val').text(address_old_val);
            $('#postcode_val').text(postcode_old_val);
            $('#ct_phone_val').text(ct_phone_old_val);
            $('#ct_email_val').text(ct_email_old_val);
            $('#industry_val').text(industry_old_val);
            $('#work_status_val').text(work_status_old_val);

            

        }

        $('#edit-profile-btn').show();
        $('#save-edit-btn').hide();
        $('#cancel-edit-btn').hide();   
        

    }

};





