

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


$(document).ready(function(){

    // DELETE JOB
    $('.delete_confirm_btn').click(function(){



    });

});