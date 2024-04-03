import { findMaxAndMinDOB, findIndustryCode, findIndustryName } from './general_utils.js';

// Storing values for edit mode
let profile_pic_old_path = $('#profile_pic_val').attr('src');
let f_name_old_val = $('#f_name_val').text().trim();
let l_name_old_val = $('#l_name_val').text().trim();
let gender_old_val = $('#gender_val').text().trim();
let d_o_b_old_val = $('#d_o_b_val').text().trim();
let bio_old_val = $('#bio_val').text().trim();
let cv_old_val = $('#cv_val a').text().trim();
let address_old_val = $('#address_val').text().trim();
let postcode_old_val = $('#postcode_val').text().trim();
let ct_phone_old_val = $('#ct_phone_val').text().trim();
let ct_email_old_val = $('#ct_email_val').text().trim();
let industry_old_val = $('#industry_val').text().trim();
let work_status_old_val = $('#work_status_val').text().trim();

let profile_pic_new = ''; // To help display changes of images in after edit mode
let is_pic_cleared = false;

$(document).ready(function(){
    
    // When user click file browse for new image will trigger
    // ------------Reference: CHATGPT(grimoire)
    $('.profile_pic_container').on('click', '.pic_edit_overlay, .edit_pic_icon', function(e) {

        e.stopPropagation(); // Prevent the click from bubbling up to the container
        $(this).closest('.profile_pic_container').find('input[name="profile_pic"]').click();
    });
    
    // Handle new image input
    $(document).on('change', 'input[name="profile_pic"]', function() {

        if (this.files && this.files[0]) {

            let reader = new FileReader(); // File handler for input type file.
            
            reader.onload = function(e) {
                $('#profile_pic_val').attr('src', e.target.result); // Update display with new file
            };

            reader.readAsDataURL(this.files[0]); // Reads file and then performs onload function
            is_pic_cleared = false;
        }
    //------------ End of Reference

    });


});
   


// EDIT BUTTON
$(document).ready(function(){
    $('#edit-profile-btn').click(function() {
        toggleEditMode(true);
    });
});


// SAVE EDIT BUTTON
$(document).ready(function(){
    $('#save-edit-btn').click(function() {

        let form = new FormData();

        // Append the text inputs to the formData
        form.append('f_name', $('input[name="f_name"]').val());
        form.append('l_name', $('input[name="l_name"]').val());
        form.append('gender', $('select[name="gender"]').val());
        form.append('d_o_b', $('input[name="d_o_b"]').val().trim());
        form.append('bio', $('textarea[name="bio"]').val());
        form.append('address', $('input[name="address"]').val());
        form.append('postcode', $('input[name="postcode"]').val());
        form.append('ct_phone', $('input[name="ct_phone"]').val());
        form.append('ct_email', $('input[name="ct_email"]').val());
        form.append('industry', $('select[name="industry"]').val());
        form.append('work_status', $('input[name="work_status"]:checked').val() === "true");  

        

        // Profile Picture File Handler
        const pic_input = $('input[name="profile_pic"]')[0];
        if (pic_input.files && pic_input.files[0]) { // if user has selected a new pic
            form.append('profile_pic_file', pic_input.files[0]);
            profile_pic_new = pic_input.files[0].name; // Stores new image for display after edit mode.
        }
        else if(is_pic_cleared) // if user has cleared out his old pic
        {
            form.append('profile_pic_file', '');
        }
        else{
            form.append('profile_pic_file', profile_pic_old_path.split('/').pop());
        }


        // CV File Handler
        const cv_input = $('input[name="cv"]')[0];
        if (cv_input.files && cv_input.files[0]) { // if user has selected a new cv
            form.append('cv_file', cv_input.files[0]);
            cv_old_val = cv_input.files[0].name;
        }
        // else{ 
        //     form.append('cv_file', cv_old_val); //Not cleared nor new selected so leaving old one.
        // }
        
        
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }
    
        // Sending to endpoint to update database.
        $.ajax({
            url: '/user/update-profile', 
            type: 'POST',
            data: form,
            processData: false, 
            contentType: false,
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

// CLEAR PHOTO BUTTON
$(document).ready(function(){
    $('#clear-pic-btn').click(function() {
        is_pic_cleared = true;
        $('#profile_pic_val').attr('src', '/img/no_profile_pic.png'); // Default picture
        profile_pic_new = ''; 
    });
});

function toggleEditMode(isEditMode, isSaved=false){


    if(isEditMode){

        // -----------UPDATE FORM
        
        // PROFILE PICTURE
        $('.profile_pic_container').html(`
                        <img id="profile_pic_val" src="${profile_pic_old_path}" alt="Profile Picture">
                        <input type="file" name="profile_pic" accept="image/png, image/jpeg, image/jpg" style="display:none;">
                        <div class="pic_edit_overlay" >
                            <img class="edit_pic_icon" src="/img/edit_pic_icon.png" alt="Click to browse">
                        </div>`);
        

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


        // CV
        $('.cv').html(`
                <strong>Current CV: </strong>
                <a href="/uploads/${cv_old_val}" target="_blank" rel="noopener noreferrer">${cv_old_val}</a>
                <button type="buttton" class="clear_btn" name="clear_cv">x</button>
                <br><br>
                <strong>Select New CV: </strong>
                <input type="file" name="cv" accept=".pdf"></input>`);

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
        $('#clear-pic-btn').show();
        $('#cancel-edit-btn').show();



    }
    else{

        if(isSaved){

            // VALIDATE


            

            // CONFIGURE AND DISPLAY NEW VALUES
            
            if(profile_pic_new !== ''){ // if there has NOT been a new pic input
                profile_pic_old_path = '/uploads/' + profile_pic_new;   
            }
            else if(is_pic_cleared){
                profile_pic_old_path = '/img/no_profile_pic.png';
            }
            
            
            $('.profile_pic_container').html(`<img id="profile_pic_val" src="${profile_pic_old_path}" alt="Profile Picture">`);

            f_name_old_val = $('input[name="f_name"]').val();
            $('#f_name_val').text(f_name_old_val || 'None');

            l_name_old_val = $('input[name="l_name"]').val();
            $('#l_name_val').text(l_name_old_val || 'None');
            
            gender_old_val = $('select[name="gender"]').val();
            $('#gender_val').text(gender_old_val || 'None');

            if($('input[name="d_o_b"]').val()){ // Check if value was given
                const parts =  $('input[name="d_o_b"]').val().trim().split('-'); // split into yyyy, mm, dd
                d_o_b_old_val = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            $('#d_o_b_val').text(d_o_b_old_val || 'None');
            
            bio_old_val = $('textarea[name="bio"]').val();
            $('#bio_val').text(bio_old_val || 'None');

            $('.cv').html(`
                            <strong>CV:</strong>
                            <span id="cv_val">
                                <a href="/uploads/${cv_old_val}" target="_blank" rel="noopener noreferrer">${cv_old_val}</a>
                            </span>`);
            
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
            $('.profile_pic_container').html(`<img id="profile_pic_val" src="${profile_pic_old_path}" alt="Profile Picture">`);
            $('#f_name_val').text(f_name_old_val);
            $('#l_name_val').text(l_name_old_val);
            $('#gender_val').text(gender_old_val);
            $('#d_o_b_val').text(d_o_b_old_val);
            $('#bio_val').text(bio_old_val);
            $('.cv').html(`
                            <strong>CV:</strong>
                            <span id="cv_val">
                                <a href="/uploads/${cv_old_val}" target="_blank" rel="noopener noreferrer">${cv_old_val}</a>
                            </span>`);
            $('#address_val').text(address_old_val);
            $('#postcode_val').text(postcode_old_val);
            $('#ct_phone_val').text(ct_phone_old_val);
            $('#ct_email_val').text(ct_email_old_val);
            $('#industry_val').text(industry_old_val);
            $('#work_status_val').text(work_status_old_val);


        }

        $('#edit-profile-btn').show();
        $('#save-edit-btn').hide();
        $('#clear-pic-btn').hide();
        $('#cancel-edit-btn').hide();   
        

    }

};





