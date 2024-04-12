$(document).ready(function(){

    // DISPLAY
    $('.table_hidden_apply_btn').click(function(){


        $('.create_application_modal').show();
        $('.modal_overlay').addClass('modal_overlay_active');


    });

    // HIDE
    $('.modal_header_close').click(function(){

        $('.create_application_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

        $('.attach_cv_err').text('');
        $('.ct_email_err').text(''); 
        $('.response_err').text('');

    });

    // HIDE
    $('.modal_cancel_btn').click(function(){

        $('.create_application_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

        $('.attach_cv_err').text('');
        $('.ct_email_err').text(''); 
        $('.response_err').text('');

    });

});


// SUBMIT APPLICATION
$(document).ready(function(){

    
    $(".job_application_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        const form = new FormData(this);

        for (let [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
        }


        $('.attach_cv_err').text('');
        $('.ct_email_err').text(''); 
        $('.response_err').text('');


        $.ajax({
            url: "/user/job/application/create",
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response.message);
                // window.location.href = `/user/job/applications`; // Redirect the user
            },
            error: function(response) {

                console.log(response);

                // Display errors
                if (response.responseJSON.errors && Object.keys(response.responseJSON.errors).length > 0){
                    const errors = response.responseJSON.errors; 
                        if (errors) {
    
                            $('.attach_cv_err').text(errors.attach_cv || ''); 
                            $('.ct_email_err').text(errors.ct_email || '');
                            $('.response_err').text(errors.response || '');

                        }
                }
                

            }
        
        });

    });

});