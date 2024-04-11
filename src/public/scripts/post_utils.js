

$(document).ready(function(){

    // DISPLAY
    $('.post_delete_btn').click(function(){

        $('.delete_post_modal').show();
        $('.modal_overlay').addClass('modal_overlay_active');


    });

    // HIDE
    $('.modal_header_close').click(function(){

        $('.delete_post_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

    // HIDE
    $('.delete_post_btn').click(function(){

        $('.delete_post_modal').hide();
        $('.modal_overlay').removeClass('modal_overlay_active');

    });

});



// DELETE JOB
$(document).ready(function(){

    
    $("#job_delete_form").submit(function(e){
        
        e.preventDefault(); // Prevent form submission

        
        const form = new FormData(this);
        // for (let [key, value] of form.entries()) {
        //     console.log(`${key}: ${value}`);
        // }




        $.ajax({
            url: "/user/job/delete",
            type: "POST",
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response.message);
                window.location.href = `/user/job/postings`; // Redirect the user
            },
            error: function(response) {

                console.log(response);

            }
        
        });

    });

});