class Response {

    constructor(id, application_id, question_id, response) {
        this.id = id;
        this.application_id = application_id;
        this.question_id = question_id;
        this.response = response;
    }

    // Create Application for job
    static async create(pool, application_id, question_id, response) {
        try {

            const question_query = `SELECT * FROM responses WHERE application_id = ($1) AND question_id = ($2)`;
            const question_params = [application_id, question_id];

            let has_responded = await pool.query(question_query, question_params); 
            
            if(await has_responded.rows.length > 0){ // Check to see if there is already response for question
                return null
            }
            else{

                const query = 
                `INSERT INTO responses(application_id, question_id, response) VALUES ($1, $2, $3) RETURNING id`;
                
                const params = 
                [application_id, question_id, response];
            
                let query_result = await pool.query(query, params);

                return await query_result.rows[0].id; 
            }              
        }   
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    
    }




    // Get applications by seeker user_id
    static async getBySeeker(pool, seeker_id){
        try{

            const query = 
            `SELECT * FROM applications WHERE seeker_id = ($1);`;
            
            const params =
            [seeker_id];

            let query_result = await pool.query(query, params);
            let applications = query_result.rows[0];

            if (applications) {
                // Returns array of applications
                return applications.rows.map(application => new Application(
                    application.id,
                    application.seeker_id,
                    application.job_id,
                    application.status,
                    application.ct_email,
                    application.cv_file,
                    application.created_at
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


    // Get applications by job_id
    static async getForJob(pool, job_id){
        try{

            const query = 
            `SELECT * FROM applications WHERE job_id = ($1);`;
            
            const params =
            [job_id];

            let query_result = await pool.query(query, params);
            let applications = query_result.rows[0];

            if (applications) {
                // Returns array of applications
                return applications.rows.map(application => new Application(
                    application.id,
                    application.seeker_id,
                    application.job_id,
                    application.status,
                    application.ct_email,
                    application.cv_file,
                    application.created_at
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