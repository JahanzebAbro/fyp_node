
// Toggle password visibility
$(document).ready(function(){

    $("input[type='checkbox']").click(function(){
        
        let input = $("#pwd"); 

        if ($(this).prop("checked")) {
            input.attr("type", "text"); // Change the input type to text
        } else {
            input.attr("type", "password"); // Change the input type to password
        }     
    });

});