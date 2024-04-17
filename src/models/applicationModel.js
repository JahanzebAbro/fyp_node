const { application } = require("express");

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


    // Get an application with it's id
    static async getById(pool, id){
        try{

            const query = 
            `SELECT * FROM applications WHERE id = ($1);`;
            
            const params = [id];

            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                // Returns array of an application
                const application = result.rows[0];

                return new Application(
                    application.id,
                    application.seeker_id,
                    application.job_id,
                    application.status,
                    application.ct_email,
                    application.cv_file,
                    application.created_at
                );

            } else {
                return null;
            }
        }
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    }


    // Get applications by seeker user_id
    static async getBySeeker(pool, seeker_id, search_query){
        try{

            let query = '';
            let result = '';
            let params = '';

            if(search_query){ // if a query is given look through search vectors

                query = `
                    SELECT DISTINCT
                        a.*,
                        ts_rank((j.search || js.search || e.search), plainto_tsquery('english', $1)) as rank
                    FROM jobs j
                    INNER JOIN employers e ON j.user_id = e.user_id
                    INNER JOIN applications a ON j.id = a.job_id
                    LEFT JOIN job_skills js ON j.id = js.job_id
                    WHERE
                        (j.search @@ plainto_tsquery('english', $1) OR
                        js.search @@ plainto_tsquery('english', $1) OR
                        e.search @@ plainto_tsquery('english', $1))
                        AND j.status = 'open'
                        AND a.seeker_id = $2
                    ORDER BY rank desc;
                `;

                params = [search_query, seeker_id];
                result = await pool.query(query, params);
            }
            else{

                query = 
                    `SELECT * FROM applications WHERE seeker_id = ($1);
                `;

                params = [seeker_id];
                result = await pool.query(query, params);
            }

        
            
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
    
    // Delete an application and all its dependents.
    static async deleteById(pool, application_id){

        try{
            
            // Start a transaction block
            await pool.query('START TRANSACTION');
            // Depedenet tables get deleted first

            // Delete reponses
            const responses_query = `
                DELETE FROM responses
                WHERE application_id = $1
            `;

            // Delete application
            const application_query = `
                DELETE FROM applications 
                WHERE id = $1 
                RETURNING id;
            `;

            
            const params = [application_id];

            // Dependents
            await pool.query(responses_query, params);
            // Application
            const result = await pool.query(application_query, params);


            if (result.rows.length > 0) {

                await pool.query('COMMIT');
                return result.rows[0].id; 
            } else {

                await pool.query('ROLLBACK');
                return null;
            }


        }
        catch(err){
            
            await pool.query('ROLLBACK');
            throw err;
        }
    }

}

module.exports = Application;