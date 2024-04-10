class Benefit{

    constructor(id, name, is_custom){
        this.id = id;
        this.name = name;
        this.is_custom = is_custom;
    }


    static async createCustom(pool, names){
        try{

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
    static async deleteCustomByJobId(pool, job_id, benefit_id) {
        try {

            // Delete from the job_benefits linking table
            const delete_link_query = `
                DELETE FROM job_benefits 
                USING benefits 
                WHERE 
                    job_benefits.job_id = $1 
                    AND job_benefits.benefit_id = $2 
                    AND benefits.id = job_benefits.benefit_id 
                    AND benefits.is_custom = true
                RETURNING job_benefits.benefit_id;
            `;

            const delete_link_result = await pool.query(delete_link_query, [job_id, benefit_id]);


            if (delete_link_result.rows.length === 0) {
                // No row was found
                return false;
            }

            // Delete benefit from table since no longer linked to job
            const benefit_query = `
                DELETE FROM benefits 
                WHERE 
                    id = $1 
                    AND is_custom = true 
                RETURNING id;
            `;

            const benefit_result = await pool.query(benefit_query, [benefit_id]);

            if (benefit_result.rows.length > 0){
                return benefit_result.rows[0].id;
            }
            else{
                return false; // could not delete benefit row.
            }


        } catch(err) {
            throw err;
        }
    }


    // ============REMEMBER USER CAN ONLY MAKE 3 CUSTOM AND HAVE 5 BENEFITS ATTACHED TO A JOB=======================

}

module.exports = Benefit;