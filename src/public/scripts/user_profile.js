// Reference: https://a-tokyo.medium.com/first-and-last-name-validation-for-forms-and-databases-d3edf29ad29d
const name_regex = 
/^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+([ \-']{0,1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+){0,2}[.]{0,1}$/;


$(document).ready(function(){

    // ------------------Toggle builder form
    $('.builder_btn').click(function(){
        $('.builder_btn').hide();
        $('.builder_form').show();
    });
});




$(document).ready(function(){

    // ------------------Date of birth range setter
    
    let curr_date = new Date();
    
    // Setting max date to 18 years and min date to 100 years ago from today.
    let max_date = new Date(curr_date.getFullYear() - 18, curr_date.getMonth(), curr_date.getDate());
    let min_date = new Date(curr_date.getFullYear() - 100, curr_date.getMonth(), curr_date.getDate());
    
    //splits the ISO string at the 'T' character, separating the date part from the time part.
    max_date = max_date.toISOString().split('T')[0]; 
    min_date = min_date.toISOString().split('T')[0]; 
    
    
    $('input[name="d_o_b"]').attr('max', max_date);
    $('input[name="d_o_b"]').attr('min', min_date);

});


// Name validity setter
$(document).ready(function(){

    $('#f_name').attr('pattern', name_regex.source);
    $('#l_name').attr('pattern', name_regex.source);

    // Display error when max char limit reached.
    $('#f_name, #l_name').on('input', function() {

        let first_name = $('#f_name').val();
        let last_name = $('#l_name').val();
        let f_name_err = $('#f_name_err');
        let l_name_err = $('#l_name_err');

        if (first_name.length > 49) {
            f_name_err.text("First name must be 50 characters or less");
        } 
        else if(last_name.length > 49){
            l_name_err.text("Last name must be 50 characters or less");
        }
        else {
            f_name_err.text("");
            l_name_err.text("");
        }
    });

    
    

});



// Form submission 
$(document).ready(function(){

    $('#seeker_builder_form').submit(function(e) {
        
        

        let first_name = $('#f_name').val();
        let last_name = $('#l_name').val();
        let f_name_err = $('#f_name_err');
        let l_name_err = $('#l_name_err');
        console.log(!name_regex.test(first_name));

        if (!name_regex.test(first_name)) {
            console.log("wrogn");
            f_name_err.text("Please enter a valid name! Make sure there are no special characters or numbers.");
            // Prevent form submission
            e.preventDefault();
            return false;
        } 
        else if(!name_regex.test(last_name)){
            l_name_err.text("Please enter a valid name! Make sure there are no special characters or numbers.");
            // Prevent form submission
            e.preventDefault();
            return false;
        }
        else {
            f_name_err.text("");
            l_name_err.text("");
        }
    });

});