class Response {

    constructor(id, application_id, question_id, response) {
        this.id = id;
        this.application_id = application_id;
        this.question_id = question_id;
        this.response = response;
    }

    // Create Application for job
    static async create(pool, application_id, question_ids, responses) {
        try {

            // Example input: question_ids = [40, 41, 43]
            // Example input: responses = ['reponse1', 'reponse2', 'response3']

            if (responses.length === 0 && question_ids.length === 0){
                return false;
            }

            let positions = responses.map((response, index) => `($1, $${index * 2 + 2}, $${index * 2 + 3})`).join(", "); 

            const query = `
                INSERT INTO responses (application_id, question_id, response)
                VALUES ${positions}
                RETURNING id;
            `;

            let params = [application_id];


            question_ids.forEach((question_id, index) => { // Keeping question id and their response adjacent
                params.push(question_id, responses[index]); 
            });


            const result = await pool.query(query, params);

            if (result){

                return result.rows;
            }
            else{
                return false;
            }           
        }   
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    
    }


    // Get responses for an application
    static async getByApplication(pool, application_id){
        try{

            const query = 
            `SELECT * FROM responses WHERE application_id = ($1);`;
            
            const params =
            [application_id];

            let result = await pool.query(query, params);

            if (result) {
                // Returns array of applications
                return result.rows.map(response => new Response(
                    response.id,
                    response.application_id,
                    response.question_id,
                    response.response
                ));

            } else {
                return null;
            }
        }
        catch(err){
            // console.log('Query problem');
            throw err;
        }

    }



    
}

module.exports = Response;