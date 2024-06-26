// APPLY MODAL
$(document).ready(function(){

    // DISPLAY
    $('.table_hidden_apply_btn').click(function(){

        const job_id = $(this).attr('data-row-job');
        let data = new FormData();
        data.append('job_id', job_id);

        $.ajax({
            url: "/user/job/search/add_start",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function(response) {
                // console.log(response)
            },
            error: function(response) {

                console.log(response);

            }
        
        });
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

        // for (let [key, value] of form.entries()) {
        //     console.log(`${key}: ${value}`);
        // }


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
                jobApplied(); // Create applied button
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


// SAVE/UNSAVE JOB 
$(document).ready(function(){

    
    $(".job_save_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        const form = new FormData(this);

        // for (let [key, value] of form.entries()) {
        //     console.log(`${key}: ${value}`);
        // }


        $.ajax({
            url: "/user/job/search/save",
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                if(response){
                    
                    console.log(response.message);
                    if(response.save_type === 'save'){
                        jobSaved(); // Create saved button
                    }
                    else if(response.save_type === 'unsave'){
                        jobUnsaved(); // Create unsaved button
                    }
                }
            },
            error: function(response) {

                console.log(response);
                

            }
        
        });

    });

});


// VIEW COUNTER
$(document).ready(function(){

    $('.table_expand_icon').click(function(){

        const row = $(this).attr('data-row');
        const job_id = $(this).attr('data-row-job');
        const is_row_hidden = $('#' + row).is(":hidden");

        if(is_row_hidden){

            let data = new FormData();
            data.append('job_id', job_id);

            $.ajax({
                url: "/user/job/search/add_view",
                type: "POST",
                data: data,
                contentType: false,
                processData: false,
                success: function(response) {
                    // console.log(response)
                },
                error: function(response) {

                    console.log(response);
    
                }
            
            });

        }

        toggleRow(row);

        

    })

});




function toggleRow(row) { 
    $(".hidden_row").not("#" + row).hide(); // hide all other other hidden rows
    $("#" + row).toggle(); 
} 

function jobApplied(){

    $('.table_hidden_apply_btn:visible').text('Applied').removeClass('table_hidden_apply_btn').addClass('table_hidden_applied_btn'); 

    $('.create_application_modal').hide();
    $('.modal_overlay').removeClass('modal_overlay_active');

    $('.attach_cv_err').text('');
    $('.ct_email_err').text(''); 
    $('.response_err').text('');

}

function jobSaved(){
    $('.table_hidden_save_btn:visible').text('Unsave').removeClass('table_hidden_save_btn').addClass('table_hidden_saved_btn'); 
}

function jobUnsaved(){
    $('.table_hidden_saved_btn:visible').text('Save').removeClass('table_hidden_saved_btn').addClass('table_hidden_save_btn'); 
}