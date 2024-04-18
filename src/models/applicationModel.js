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
    static async getBySeeker(pool, seeker_id, filters){
        try{

            let query = `
                SELECT DISTINCT
                    a.*,
                    ts_rank((j.search || js.search || e.search), plainto_tsquery('english', $2)) as rank
                FROM jobs j
                INNER JOIN employers e ON j.user_id = e.user_id
                INNER JOIN applications a ON j.id = a.job_id
                LEFT JOIN job_skills js ON j.id = js.job_id
                LEFT JOIN (
                    SELECT jjt.job_id, STRING_AGG(name, ' ') AS types
                        FROM job_types t
                        INNER JOIN jobs_job_types jjt ON t.id = jjt.type_id
                        GROUP BY jjt.job_id
                    ) jt ON j.id = jt.job_id
                WHERE 
                    j.status = 'open'
                    AND a.seeker_id = $1
            `;


            let params = [seeker_id];
            let params_index = 2; 

            // Check SEARCH
            if (filters.search) {

                query += ` AND (j.search @@ plainto_tsquery('english', $${params_index}) OR
                    js.search @@ plainto_tsquery('english', $${params_index}) OR
                    e.search @@ plainto_tsquery('english', $${params_index}))
                `;
                params.push(filters.search);
                params_index++;
            }
            else{
                params.push(''); // In order to run ts rank 
                params_index++;
            }


            // Check MIN PAY
            if (filters.min_pay) {

                query += ` AND j.min_pay >= $${params_index}`;
                params.push(filters.min_pay);
                params_index++;
            }

        
            // Check STYLE
            if (filters.work_style.length > 0) { // Example ['Hybrid', 'Remote']
                const placeholders = filters.work_style.map((style, index) => `$${params_index + index}`).join(', ');

                query += ` AND j.style IN (${placeholders})`;
                params.push(...filters.work_style);
                params_index += filters.work_style.length;
            }


            // Check TYPE
            if (filters.job_type.length > 0) { // Example ['Full-Time', 'Part-Time']

                const placeholders = filters.job_type.map((style, index) =>  `jt.types LIKE $${params_index + index}`).join(' OR ');;

                query += ` AND (${placeholders})`;
                params.push(...filters.job_type.map(type => `%${type}%`));
                params_index += filters.job_type.length;
            }
        

            
            // Rank by search or creation
            query += filters.search ? ` ORDER BY rank DESC` : ` ORDER BY a.created_at DESC`;

            const result = await pool.query(query, params);



        
            
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
    static async getForJob(pool, job_id, filters){
        try{

            let query = 
            `SELECT * FROM applications a WHERE job_id = ($1)`;

            const params = [job_id];
            let params_index = 2;

            // Check STATUS
            if (filters.status.length > 0) { // Example ['pending', 'declined']
                const placeholders = filters.status.map((style, index) => `$${params_index + index}`).join(', ');

                query += ` AND a.status IN (${placeholders})`;
                params.push(...filters.status);
                params_index += filters.status.length;
            }
            
            

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