class Benefit{

    constructor(id, name, is_custom){
        this.id = id;
        this.name = name;
        this.is_custom = is_custom;
    }


    static async createCustom(pool, name){
        try{

            const query = `
                INSERT INTO benefits(name, is_custom)
                VALUES ($1, TRUE)
                RETURNING id;
            `;

            const params = [name];
            const result = await pool.query(query, params);

            return result.rows[0].id;

        }
        catch(err){
            throw err;
        }
    }


    // Retrieves DEFAULT benefits (NON-CUSTOM)
    static async getAll(pool){
        try{

            const query = "SELECT id, name FROM benefits WHERE is_custom='false';";
            const result = await pool.query(query);

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


    // Get all benefits that is under that job id.
    static async getAllByJobId(pool, job_id){
        try {
           
            const query = `
                SELECT benefits.* FROM benefits
                INNER JOIN job_benefits ON benefits.id = job_benefits.benefit_id
                WHERE job_benefits.job_id = $1;
            `;


            const params = [job_id];
    
            const benefits  = await pool.query(query, params);

            // returns array of benefit(s).
            return benefits;

        } catch (err) {

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