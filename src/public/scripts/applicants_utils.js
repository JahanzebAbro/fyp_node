$(document).ready(function(){

    $('.dropdown_content_item').click(function() {
        const application_id = $(this).data('application_id');  
        const new_status = this.id;

        updateApplicantStatus(application_id, new_status);
    });


});


function updateApplicantStatus(application_id, new_status){

    const form = new FormData();
    form.append('application_id', application_id);
    form.append('new_status', new_status);


    $.ajax({
        url: "/user/job/applicants/status",
        type: "POST",
        data: form,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log(response.message);
            location.reload();
            // window.location.href = `/user/job/applicants/${job_id}`; // Redirect the user
        },
        error: function(response) {

            console.log(response);
            
        }
    
    });

}