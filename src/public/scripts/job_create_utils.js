
// ADD BENEFIT FUNCTIONALITY
$(document).ready(function(){

    let custom_benefits_count = 1;
    // ADD BUTTON
    $('#add_benefit_btn').click(function() {
        const custom_benefit = $('#custom_benefit').val();

        if(custom_benefit && custom_benefits_count <= 3){
            $('.new_benefits').append(`
                <label for="custom${custom_benefits_count}"> 
                    <p><input id="custom_${custom_benefits_count}" type="checkbox" name="custom_benefits" 
                        value="${custom_benefit}"> ${custom_benefit}
                    </p>
                </label>
            `);

            $('#clear_benefit_btn').show();
            custom_benefits_count++;
        }
        
        if(custom_benefits_count > 3){
            $('#add_benefit_btn').prop('disabled', true);
        }

        $('#custom_benefit').val(''); // Clear field after add
    });


    // CLEAR BUTTON
    $('#clear_benefit_btn').click(function(){

        $('.new_benefits').text('');
        $('#clear_benefit_btn').hide();
        custom_benefits_count = 1; // Reset the counter
        $('#add_benefit_btn').prop('disabled', false);

    });

});





// ADD QUESTION CREATOR
$(document).ready(function(){

    let question_count = 1;

    $('#add_question_btn').click(function(){
           
        if(question_count <= 5){ // MAX 5 QUESTIONS
            $('.questions_container').append(`
                <div id="single_question_container_${question_count}" class="single_question_container">
                    <div>
                        <label for="question_${question_count}">Question ${question_count}</label><br>
                        <textarea rows="2" cols="75" id="question_${question_count}" name="questions" placeholder="Type out your question here!" maxlength="200"></textarea>
                    </div>
                    <div>
                        <label for="response_type_${question_count}">Response Type</label><br>
                        <select id="response_type_${question_count}" name="response_types">
                            <option value="text">Text</option>
                            <option value="num">Number</option>
                            <option value="bool">Yes/No</option>
                        </select><br>
                    </div>
                    <div>
                        <span">Required?</span><br>
                        <span><input type="radio" name="question_reqs_${question_count}" value="true"> Yes</span>
                        <span><input type="radio" name="question_reqs_${question_count}" value="false" checked> No</span>
                    </div>
                </div>
            `);

            $('#clear_question_btn').show();
            question_count++;
        }
        
        if(question_count > 5){
            $('#add_question_btn').prop('disabled', true);
        }

    });


    // CLEAR THE MOST RECENT QUESTION ONLY
    $('#clear_question_btn').click(function() {


        if(question_count > 1 ) {
            question_count--; 
            $(`#single_question_container_${question_count}`).remove(); // Remove the last question
        }

        if(question_count <= 1) {
            $('#clear_question_btn').hide(); 
        }

        if(question_count <=5){
            $('#add_question_btn').prop('disabled', false);
        }

    });

});






// ADD SKILL CREATOR
$(document).ready(function(){

    let skill_count = 1;

    $('#add_skill_btn').click(function(){
           
        const new_skill = $('#new_skill').val();

        if(new_skill && skill_count <= 5){
            $('.new_skills').append(`
                <label for="skill_${skill_count}"> 
                    <input type="hidden"id="skill_${skill_count}" name="skills" value="${new_skill}">
                    <span>${skill_count}. ${new_skill}</span><br>
                </label>
            `);

           
            $('#clear_skill_btn').show();
            skill_count++;
        }

        
        
        if(skill_count > 5){
            $('#add_skill_btn').prop('disabled', true);
        }

        $('#new_skill').val('');

    });


    // CLEAR THE MOST RECENT SKILL ONLY
    $('#clear_skill_btn').click(function() {


        if(skill_count > 1 ) {
            skill_count--; 
            $(`label[for="skill_${skill_count}"]`).remove(); // Remove the last question
        }

        if(skill_count <= 1) {
            $('#clear_skill_btn').hide(); 
        }

        if(skill_count <=5){
            $('#add_skill_btn').prop('disabled', false);
        }

    });

});



// JOB STATUS INFO GET
$(document).ready(function(){
    

    // For when page loads up.
    if($('#job_status').val() === 'open'){
        $('.job_status_info').html(`
        <strong>Open</strong> means the job is public and applications can be made.
        `);
    }
    else if($('#job_status').val() === 'hidden'){
        $('.job_status_info').html(`
        <strong>Hidden</strong> means the job is private.
        `);
    }
    else if($('#job_status').val() === 'closed'){
        $('.job_status_info').html(`
        <strong>Closed</strong> means the job is public but no applications can be made.
        `);
    }


    // Upon user selection
    $('#job_status').on('change', function(){

        if($(this).val() === 'open'){
            $('.job_status_info').html(`
            <strong>Open</strong> means the job is public and applications can be made.
            `);
        }
        else if($(this).val() === 'hidden'){
            $('.job_status_info').html(`
            <strong>Hidden</strong> means the job is private.
            `);
        }
        else if($(this).val() === 'closed'){
            $('.job_status_info').html(`
            <strong>Closed</strong> means the job is public but no applications can be made.
            `);
        }


    }) 
    
});