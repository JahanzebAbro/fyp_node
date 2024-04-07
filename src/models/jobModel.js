class Job {

    constructor(id, user_id, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.openings = openings;
        this.description = description;
        this.style = style;
        this.address = address;
        this.postcode = postcode;
        this.min_pay = min_pay;
        this.max_pay = max_pay;
        this.cv_req = cv_req;
        this.deadline = deadline;
        this.start_date = start_date;
    }

    static async create(pool, 
        user_id, 
        title, 
        openings, 
        description, 
        style, 
        address, 
        postcode, 
        min_pay, 
        max_pay, 
        cv_req, 
        deadline, 
        start_date) {
        try {
            const query = `
                INSERT INTO jobs(user_id, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id;
            `;

            const params = [user_id, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date];
            const result = await pool.query(query, params);

            return result.rows[0].id;
        } catch(err) {
            throw err;
        }
    }

    static async getById(pool, id) {
        try {
            const query = `
                SELECT * FROM jobs WHERE id = $1;
            `;
            
            const params = [id];
            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                const job = result.rows[0];
                return new Job(
                    job.id,
                    job.user_id,
                    job.title,
                    job.openings,
                    job.description,
                    job.style,
                    job.address,
                    job.postcode,
                    job.min_pay,
                    job.max_pay,
                    job.cv_req,
                    job.deadline,
                    job.start_date
                );
            } else {
                return null;
            }
        } catch(err) {
            throw err;
        }
    }


    // Retrieve all jobs for a user id
    static async getJobsByUser(pool, user_id) {
        try {
            const query = `
                SELECT * FROM jobs WHERE user_id = $1;
            `;
            
            const params = [user_id];
            const result = await pool.query(query, params);

            // Returns array of Jobs
            return result.rows.map(job => new Job(
                job.id,
                job.user_id,
                job.title,
                job.openings,
                job.description,
                job.style,
                job.address,
                job.postcode,
                job.min_pay,
                job.max_pay,
                job.cv_req,
                job.deadline,
                job.start_date
            ));
        } catch(err) {
            throw err;
        }
    }

    // Update job details
    static async update(pool, id, fields) {
        try {

            const set_columns = [];
            const params = [];

            Object.entries(fields).forEach(([column, value], index) => {
                set_columns.push(`${column} = $${index + 1}`);
                params.push(value);
            });
            
            params.push(id);

            if (set_columns.length === 0) {
                return 'Nothing to update';
            }

            const query = `
                UPDATE jobs
                SET ${set_columns.join(', ')}
                WHERE id = $${set_columns.length + 1}
                RETURNING id;
            `;

            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                
                return result.rows[0].id;
            } else {

                return null;
            }

        } catch(err) {

            throw err;
        }
    }

    // Delete a job with it's id
    static async deleteById(pool, id) {
        try {

            const query = `
                DELETE FROM jobs WHERE id = $1 RETURNING id;
            `;
            
            const params = [id];
            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                return result.rows[0].id; 
            } else {
                return null;
            }

        } catch(err) {

            throw err;
        }
    }

    




    // Construct a relationship between a job and multiple types (using their id)
    static async addTypesToJob(pool, job_id, types){
        try{

            
            // Check if there are types to add
            if (types.length === 0) {
                throw new Error("No types provided");
            }

            // Loop through each type and insert it into the database
            for (const type_id of types) {
                // Prepare the SQL query for inserting a single job type
                const query = `
                    INSERT INTO job_job_types(job_id, type_id)
                    VALUES ($1, $2);
                `;

                // Parameters for the SQL query
                const params = [job_id, type_id];

                // Execute the query for the current type_id
                await pool.query(query, params);
            }


        }catch(err){
            throw err;
        }
    }

    // Grabs all job types a job id has
    static async getTypesFromJob(pool, job_id){


    }


    // Grabs all job types
    static async getAllJobTypes(pool){
        try{
            
            const query = 'SELECT * FROM job_types;';
            const result = await pool.query(query);

            // Array of job types
            return result.rows;
        }
        catch(err){
            throw err;
        }
    }


}

module.exports = Job;
