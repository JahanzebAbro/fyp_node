
const text_regex = /^$|^[a-zA-Z0-9 .,!?;:'"“”‘’\-_\n]+$/;


// Make sure cv attach is checked for cv required jobs
exports.validateAttachCV = function(req, res, next){
    let { attach_cv, cv_req } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    attach_cv = !!attach_cv;

    if (!attach_cv && cv_req === 'true'){
        req.validation_errors.attach_cv = "A CV attachment is required for this job.";
        return next();
    }

    req.body.attach_cv = attach_cv;

    next();
}




exports.validateResponses = function(req, res, next){
    let { 
        questions,
        response_1,
        response_2,
        response_3,
        response_4,
        response_5  
    } = req.body;

    // Initialize if not
    if (!req.validation_errors){ 
        req.validation_errors = {};
    }

    questions = JSON.parse(questions); // array of objects

    if(questions.length > 0){

        // Check whether responses were required for a question.
        // Check if response were in right format for text, bool, number.

        let responses = [response_1, response_2, response_3, response_4, response_5];
        let valid_responses = [];

        questions.forEach(function(question, index) {

            if (question.is_req && !responses[index]){ // if question is required and response is empty
                req.validation_errors.response = `Question ${index + 1} requires a response in order to apply.`;
                return next();
            }

            if (responses[index]){ // If a response was given

                
                if(question.response_type === 'text' && !text_regex.test(responses[index])){ // Check for text responses
                    req.validation_errors.response = `Question ${index + 1} contains invalid characters.`;
                    return next();
                }
                
                if(question.response_type === 'num'){
                    if(isNaN(responses[index])){
                        req.validation_errors.response = `Question ${index + 1} must be an number`;
                        return next();
                    }
                }

                if(question.response_type === 'bool'){
                    if(responses[index] !== 'true' && responses[index] !== 'false'){
                        req.validation_errors.response = `Question ${index + 1} has an invalid response.`;
                        return next();
                    }
                }
                
            }

            valid_responses.push(responses[index]);

        });


        req.body.responses = valid_responses; 
        return next();
        
    }


    req.body.responses = []; 

    next();
}