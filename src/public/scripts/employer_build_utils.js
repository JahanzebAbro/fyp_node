
// Form submission 
$(document).ready(function(){

    $("#employer_builder_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        
        const form = new FormData(this);
        for (let [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
            if (value instanceof File) {
                console.log(value); // Check if the file size is greater than 0
            }
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



        $.ajax({
            url: "/user/profile/builder/employer",
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