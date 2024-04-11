class Benefit{

    constructor(id, name, is_custom){
        this.id = id;
        this.name = name;
        this.is_custom = is_custom;
    }


    static async createCustom(pool, names){
        try{

            if (names.length === 0) {
                return null;
            }

            const positions = names.map((name, index) => `($${index + 1}, TRUE)`).join(', ');

            const query = `
                INSERT INTO benefits(name, is_custom)
                VALUES ${positions}
                RETURNING id;
            `;

            const result = await pool.query(query, names);

            // Return array of ids
            return result.rows.map(row => row.id); // Reference: Chat GPT4 

        }
        catch(err){
            throw err;
        }
    }


    // Retrieves DEFAULT benefits (NON-CUSTOM)
    static async getAll(pool){
        try{

            const query = "SELECT * FROM benefits WHERE is_custom='false';";
            const result = await pool.query(query);

            // Array of benefits
            return result.rows;
        }
        catch(err){
            throw err
        }
    }


    // Retrieves ALL benefits PLUS custom for a SPECIFIC JOB
    static async getAllForJob(pool, job_id){
        try{

            const query = `
                SELECT benefits.* 
                FROM benefits 
                WHERE benefits.is_custom = false
                UNION
                SELECT benefits.* 
                FROM benefits 
                JOIN job_benefits ON job_benefits.benefit_id = benefits.id
                WHERE job_benefits.job_id = $1;
            `; // Grabbing all non-custom benefits first and then joining with only the customs for the job.

            const params = [job_id];
            
            const result = await pool.query(query, params);

            // Array of benefits
            return result.rows;
        }
        catch(err){
            throw err
        }
    }


    // Get a SPECIFIC benefit with it's id.
    static async getById(pool, id){
        try {

            const query = `
                SELECT * FROM benefits WHERE id = $1;
            `;
            
            const params = [id];
            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                const benefit = result.rows[0];
                return new Benefit(
                    benefit.id,
                    benefit.name,
                    benefit.is_custom
                );

            } else {

                return null;
            }

        } catch(err) {
            throw err;
        }
    }


    // Delete a custom benefit with it's benefit.id and job.id
    static async deleteCustomByJob(pool, job_id) {
        try {

             // Start a transaction block
             await pool.query('START TRANSACTION');

            // Delete from the job_benefits linking table
            const delete_link_query = `
                DELETE FROM job_benefits
                WHERE job_id = $1
                AND benefit_id IN (SELECT id FROM benefits WHERE is_custom = true);
            `; // Makes sure we are only deleting a custom job.

                
            const delete_link_result = await pool.query(delete_link_query, [job_id]);


            // Delete benefit from table since no longer linked to job
            const benefit_query = `
                DELETE FROM benefits
                WHERE is_custom = true
                AND id NOT IN (SELECT benefit_id FROM job_benefits);
            `;

            const benefit_result = await pool.query(benefit_query);

            if (benefit_result.rows.length > 0){
                 
                await pool.query('COMMIT');
                return benefit_result.rows[0].id;
            }
            else{

                await pool.query('ROLLBACK');
                return false; // could not delete benefit row.
            }


        } catch(err) {

            await pool.query('ROLLBACK');
            throw err;
        }
    }


    static async updateCustom(pool, job_id, names){
        try{

            // Start a transaction block
            await pool.query('START TRANSACTION');

            // Delete current customs links by a job_id
            await this.deleteCustomByJob(pool, job_id);            

            // Insert the new customs

            let result = await this.createCustom(pool, names)

            if(result){

                await pool.query('COMMIT');
                return result;
            }else{

                await pool.query('ROLLBACK');
                return false;
            }

        }
        catch(err){
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    // ============REMEMBER USER CAN ONLY MAKE 3 CUSTOM AND HAVE 5 DEFAULT BENEFITS ATTACHED TO A JOB=======================

}

module.exports = Benefit;