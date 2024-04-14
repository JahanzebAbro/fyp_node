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