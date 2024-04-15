// APPLICATION SUBMISSION MODAL DISPLAY
$(document).ready(function(){

    // DISPLAY
    $('.table_hidden_submission_btn').click(function(){


        $('.submission_modal').show();
        $('.modal_overlay').addClass('modal_overlay_active');


    });

    // HIDE
    $('.modal_header_close').click(function(){

        $('.submission_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

    // HIDE
    $('.modal_cancel_btn').click(function(){

        $('.submission_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

});



// CLEAR APPLICATION MODAL DISPLAY
$(document).ready(function(){

    // DISPLAY
    $('.table_hidden_clear_btn').click(function(){


        $('.clear_application_modal').show();
        $('.modal_overlay').addClass('modal_overlay_active');


    });

    // HIDE
    $('.modal_header_close').click(function(){

        $('.clear_application_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

    // HIDE
    $('.modal_cancel_btn').click(function(){

        $('.clear_application_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

});


// DELETE APPLICATION
$(document).ready(function(){

    
    $("#application_delete_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        
        const form = new FormData(this);

        // for (let [key, value] of form.entries()) {
        //     console.log(`${key}: ${value}`);
        // }




        $.ajax({
            url: "/user/job/application/delete",
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response.message);
                location.reload();
            },
            error: function(response) {

                console.log(response);

            }
        
        });

    });

});