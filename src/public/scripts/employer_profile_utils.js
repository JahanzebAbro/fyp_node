import { findIndustryCode, findIndustryName } from './general_utils.js';

// Storing values for edit mode
let profile_pic_old_path = $('#profile_pic_val').attr('src');
let comp_name_old_val = $('#comp_name_val').text().trim();
let comp_size_old_val = $('#comp_size_val').text().replace(' people', '').trim();
let bio_old_val = $('#bio_val').text().trim();
let website_old_val = $('#website_val a').text().trim();
let address_old_val = $('#address_val').text().trim();
let postcode_old_val = $('#postcode_val').text().trim();
let ct_phone_old_val = $('#ct_phone_val').text().trim();
let ct_email_old_val = $('#ct_email_val').text().trim();
let industry_old_val = $('#industry_val').text().trim();

// Setting all fields with 'None' to null.
comp_size_old_val = emptyFieldToNullString(comp_size_old_val);
bio_old_val = emptyFieldToNullString(bio_old_val);
website_old_val = emptyFieldToNullString(website_old_val);
address_old_val = emptyFieldToNullString(address_old_val);
postcode_old_val = emptyFieldToNullString(postcode_old_val);
ct_phone_old_val = emptyFieldToNullString(ct_phone_old_val);
ct_email_old_val = emptyFieldToNullString(ct_email_old_val);


let profile_pic_new = ''; // To help display changes of images in after edit mode
let is_pic_cleared = false;


// PROFILE PIC FILE BROWSE
$(document).ready(function(){
    
    // When user click file browse for new image will trigger
    // ------------Reference: CHATGPT(grimoire)
    $('.profile_pic_container').on('click', '.pic_edit_overlay, .edit_pic_icon', function(e) {

        e.stopPropagation(); // Prevent the click from bubbling up to the container
        $(this).closest('.profile_pic_container').find('input[name="profile_pic"]').click();
    });
    
    // Handle new image input afer selection
    $(document).on('change', 'input[name="profile_pic"]', function() {

        if (this.files && this.files[0]) {

            let reader = new FileReader(); // File handler for input type file.
                
            reader.onload = function(e) {
                $('#profile_pic_val').attr('src', e.target.result); // Update display with new file
            };

            reader.readAsDataURL(this.files[0]); // Reads file and then performs onload function
            profile_pic_new = this.files[0].name; // For display after saving.
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
        form.append('comp_name', $('input[name="comp_name"]').val());
        form.append('comp_size', $('input[name="comp_size"]').val());
        form.append('bio', $('textarea[name="bio"]').val());
        form.append('website', $('input[name="website"]').val());
        form.append('address', $('input[name="address"]').val());
        form.append('postcode', $('input[name="postcode"]').val());
        form.append('ct_phone', $('input[name="ct_phone"]').val());
        form.append('ct_email', $('input[name="ct_email"]').val());
        form.append('industry', $('select[name="industry"]').val());
        form.append('is_pic_cleared', is_pic_cleared);
        
        // Handling profile picture file input
        let pic_input = $('input[name="profile_pic"]')[0]; // Access the DOM element directly
        if (!is_pic_cleared && pic_input.files && pic_input.files[0]) {
            form.append('profile_pic_file', pic_input.files[0]); // Append the file to FormData
        }
        else{
            form.append('profile_pic_file', '');
        }

        

         // Clear any previous error messages
         $('#comp_name_err').text('');
         $('#comp_size_err').text('');
         $('#bio_err').text('');
         $('#website_err').text('');
         $('#address_err').text('');
         $('#postcode_err').text('');
         $('#ct_phone_err').text('');
         $('#ct_email_err').text('');
         $('#industry_err').text('');
         $('#pic_err').text('');

        
        // Sending to endpoint to update database.
        $.ajax({
            url: '/user/update-profile/employer', 
            type: 'POST',
            data: form,
            processData: false, 
            contentType: false,
            success: function(response) {
                console.log(response.message);
                toggleEditMode(false, true); // Turn off edit mode and fix input values into display
                
            },
            error: function(response) {

                console.log(response);

                // Display errors
                if (response.responseJSON.errors && Object.keys(response.responseJSON.errors).length > 0){
                const errors = response.responseJSON.errors; 
                    if (errors) {

                        $('#comp_name_err').text(errors.comp_name || '');
                        $('#comp_size_err').text(errors.comp_size || '');
                        $('#bio_err').text(errors.bio || '');
                        $('#website_err').text(errors.website || '');
                        $('#address_err').text(errors.address || '');
                        $('#postcode_err').text(errors.postcode || '');
                        $('#ct_phone_err').text(errors.ct_phone || '');
                        $('#ct_email_err').text(errors.ct_email || '');
                        $('#industry_err').text(errors.industry || '');
                        $('#pic_err').text(errors.profile_pic_file || '');

                    }
                }
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
        

        // COMPANY NAME
        $('#comp_name_val').html(`<input type="text" name="comp_name" maxlength="50" value="${comp_name_old_val}">`);


        // COMPANY SIZE
        $('#comp_size_val').html(`<input type="text" name="comp_size" maxlength="50" value="${comp_size_old_val}" placeholder="(in terms of personnel)">`);

        
        
        // BIOGRAPHY
        $('#bio_val').html(`<textarea name="bio" rows="10" cols="100" maxlength="800" 
            placeholder="Let others know more about YOU with a short description of what you're all about!">${bio_old_val}</textarea>`);


        // WEBSITE
        $('.website').html(`
                <strong>Website</strong><br>
                <span id="website_val">
                    <input type="text" id="website" name="website" maxlength="50" value="${website_old_val}" placeholder="(Place an url/link here)"><br>
                </span>
                `);


        // ADDRESS
        $('#address_val').html(`<input type="text" name="address" value="${address_old_val}">`);

        // POSTCODE
        $('#postcode_val').html(`<input type="text" name="postcode" value="${postcode_old_val}">`);

        // CONTACT PHONE
        $('#ct_phone_val').html(`<input type="text" name="ct_phone" value="${ct_phone_old_val}">`);

        // CONTACT EMAIL
        $('#ct_email_val').html(`<input type="email" name="ct_email" value="${ct_email_old_val}">`);

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
        $('select[name="industry"]').val(findIndustryCode(industry_old_val) || ''); // Pre-selecting option based on old value.
        
                                                  
                                    

        // Button displays
        $('#edit-profile-btn').hide();
        $('#save-edit-btn').show();
        $('#clear-pic-btn').show();
        $('#cancel-edit-btn').show();



    }
    else{

        if(isSaved){

            
            //===============SAVE EDIT

            if(profile_pic_new){ // if there has been a new pic input
                profile_pic_old_path = '/uploads/' + profile_pic_new;   
            }
            else if(is_pic_cleared){
                profile_pic_old_path = '/img/no_profile_pic.png';
            }
            
            
            $('.profile_pic_container').html(`<img id="profile_pic_val" src="${profile_pic_old_path}" alt="Profile Picture">`);
            $('.user_icon').attr('src', `${profile_pic_old_path}`);

            comp_name_old_val = $('input[name="comp_name"]').val();
            $('#comp_name_val').text(comp_name_old_val || 'None');

            comp_size_old_val = $('input[name="comp_size"]').val();
            $('#comp_size_val').text(comp_size_old_val ? comp_size_old_val + ' people' : 'None');
            
            bio_old_val = $('textarea[name="bio"]').val();
            $('#bio_val').text(bio_old_val || 'None');


            website_old_val = $('input[name="website"]').val();
            if(website_old_val){
                $('.website').html(`
                                <strong>Website</strong><br>
                                <span id="website_val">
                                    <a href="${website_old_val}" target="_blank" rel="noopener noreferrer">${website_old_val}</a>
                                </span>`);
            }
            else{
                $('.website').html(`
                            <strong>Website</strong><br>
                            <span id="website_val">
                                <a>None</a>
                            </span>`);
            }

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
                                              
        }
        else{


            // =============CANCEL EDIT

            // Clear any previous error messages
            $('#comp_name_err').text('');
            $('#comp_size_err').text('');
            $('#bio_err').text('');
            $('#website_err').text('');
            $('#address_err').text('');
            $('#postcode_err').text('');
            $('#ct_phone_err').text('');
            $('#ct_email_err').text('');
            $('#industry_err').text('');
            $('#pic_err').text('');

            // Convert input fields back to text with old values or 'None' if they had no value.
            $('.profile_pic_container').html(`<img id="profile_pic_val" src="${profile_pic_old_path}" alt="Profile Picture">`);
            $('#comp_name_val').text(comp_name_old_val || 'None');
            $('#comp_size_val').text(comp_size_old_val ? comp_size_old_val + ' people' : 'None');
            $('#bio_val').text(bio_old_val || 'None');

            if(website_old_val){
                $('.website').html(`
                                <strong>Website</strong><br>
                                <span id="website_val">
                                    <a href="${website_old_val}" target="_blank" rel="noopener noreferrer">${website_old_val}</a>
                                </span>`);
            }
            else{
                $('.website').html(`
                            <strong>Website</strong><br>
                            <span id="website_val">
                                <a>None</a>
                            </span>`);
            }


            $('#address_val').text(address_old_val || 'None');
            $('#postcode_val').text(postcode_old_val || 'None');
            $('#ct_phone_val').text(ct_phone_old_val || 'None');
            $('#ct_email_val').text(ct_email_old_val || 'None');
            $('#industry_val').text(industry_old_val || 'None');


        }

        $('#edit-profile-btn').show();
        $('#save-edit-btn').hide();
        $('#clear-pic-btn').hide();
        $('#cancel-edit-btn').hide();   
        

    }

};





function emptyFieldToNullString(value) {
  return value === 'None' ? '' : value;
}
