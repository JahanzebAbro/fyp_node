class Application {

    constructor(id, seeker_id, job_id, status, ct_email, cv_file, created_at) {
        this.id = id;
        this.seeker_id = seeker_id;
        this.job_id = job_id;
        this.status = status;
        this.ct_email = ct_email;
        this.cv_file = cv_file;
        this.created_at = created_at;

    }

    // Create Application for job
    static async create(pool, seeker_id, job_id, ct_email, cv_file) {
        try {

            const seeker_query = `SELECT * FROM applications WHERE seeker_id = ($1) AND job_id = ($2)`;
            const seeker_params = [seeker_id, job_id];

            let has_applied = await pool.query(seeker_query, seeker_params);
            
            if(await has_applied.rows.length > 0){ // Check to see if this seeker has applied to the same job before.
                return null
            }
            else{

                const query = 
                `INSERT INTO applications(seeker_id, job_id, ct_email, cv_file) VALUES ($1, $2, $3, $4) RETURNING id`;
                
                const params = 
                [seeker_id, job_id, ct_email, cv_file];
            
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

            let result = await pool.query(query, params);
            let applications = result.rows;

            if (applications) {
                // Returns array of applications
                return applications.map(application => new Application(
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

            let result = await pool.query(query, params);


            if (result) {
                // Returns array of applications
                return result.rows.map(application => new Application(
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


    // Check to see if a seeker has applied to a job
    static async hasApplied(pool, seeker_id, job_id){

        try{

            const query = 
            `SELECT id FROM applications WHERE seeker_id = ($1) AND job_id = ($2)`;
            
            const params =
            [seeker_id, job_id];

            let result = await pool.query(query, params);

            if(result.rows.length > 0){
                return true;
            }
            else{
                return false;
            }

        }catch(err){

            throw err;
        }

    }


    static async changeStatus(pool, application_id, new_status){

        try{

            const query = `
                UPDATE applications
                SET status = $1
                WHERE id = $2
                RETURNING id;
            `;

            const params = [new_status, application_id];

            const result = await pool.query(query, params);

            if (result.rows.length > 0) {

                return result.rows[0]; 
            }

        }
        catch(err){
            throw err;
        }

    }
    
}

module.exports = Application;