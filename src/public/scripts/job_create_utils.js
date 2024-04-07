
// ADD BENEFIT FUNCTIONALITY
$(document).ready(function(){

    let custom_benefits_count = 1;
    // ADD BUTTON
    $('#add_benefit_btn').click(function() {
        const custom_benefit = $('#custom_benefit').val();

        if(custom_benefit && custom_benefits_count <= 3){
            $('.new_benefits').append(`
                <label for="custom${custom_benefits_count}"> 
                    <p><input id="custom${custom_benefits_count}" type="checkbox" name="benefits" value="custom"> ${custom_benefit}</p>
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
                        <textarea rows="2" cols="75" id="question_${question_count}" name="question" placeholder="Type out your question here!" maxlength="200"></textarea>
                    </div>
                    <div>
                        <label for="response_type_${question_count}">Response Type</label><br>
                        <select id="response_type_${question_count}" name="response_type">
                            <option value="text">Text</option>
                            <option value="num">Number</option>
                            <option value="bool">Yes/No</option>
                        </select><br>
                    </div>
                    <div>
                        <label for="question_${question_count}_req">Required?</label><br>
                        <span><input id="question_${question_count}_req" type="checkbox" name="question_req" value="true"> Yes</span>
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
           
        const new_skill = $('#skill').val();

        if(new_skill && skill_count <= 5){
            $('.new_skills').append(`
                <label for="skill_${skill_count}"> 
                    <input type="hidden"id="skill_${skill_count}" value="${new_skill}">
                    <span>${skill_count}. ${new_skill}</span><br>
                </label>
            `);

           
            $('#clear_skill_btn').show();
            skill_count++;
        }

        
        
        if(skill_count > 5){
            $('#add_skill_btn').prop('disabled', true);
        }

        $('#skill').val('');

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