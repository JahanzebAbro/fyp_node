class Job {

    constructor(id, user_id, status, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date, created_at) {
        this.id = id;
        this.status = status;
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
        this.created_at = created_at;
    }


    static async create(pool, 
        user_id, 
        status,
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
                INSERT INTO jobs(user_id, status, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id;
            `;

            const params = [user_id, status, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date];
            const result = await pool.query(query, params);

            return result.rows[0].id;

        } catch(err) {

            throw err;
        }
    }


    // Grab a specific job id.
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
                    job.status,
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
                    job.start_date,
                    job.created_at
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
                job.status,
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
                job.start_date,
                job.created_at
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

    
    // ======================================JOB TYPE METHODS=============================================================



    // Construct a relationship between a job and multiple types (using their id)
    static async addTypes(pool, job_id, types){
        try{

            // Example Input: types = [1,3]

            // Check if there are types to add
            if (types.length === 0) {
                return "No types provided";
            }

             // Reference help: CHATGPT 4
            let positions = types.map((type_id, index) => `($1, $${index + 2})`).join(", "); 
            // End reference
            // Above, $1 is a constant so that doesn't get increased with each type.
            // We are adding 2 indexes with every row added for type_id.

            const query = `
                INSERT INTO jobs_job_types (job_id, type_id)
                VALUES ${positions}
                RETURNING job_id, type_id;
            `;

            const params = [job_id].concat(types); // Joining arrays

            
            const result = await pool.query(query, params);

            if (result){

                return result;
            }
            else{
                return false;
            }


        }catch(err){
            throw err;
        }
    }


    // Grabs all types for a job
    static async getTypesByJob(pool, job_id){
        try {

            const query = `
                SELECT job_types.id, job_types.name
                FROM job_types
                JOIN jobs_job_types ON job_types.id = jobs_job_types.type_id
                WHERE jobs_job_types.job_id = $1;
            `;
            // Above returns job type id and name by joining job_types and junction table based on given job id.
            
            const params = [job_id];
    
    
            const result = await pool.query(query, params);

            if(result){
                 return result.rows;
            }
            else{
                return false;
            }

        } catch(err) {
            
            throw err;
        }

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


    // =======================================JOB BENEFITS=============================================================


    // Construct a relationship between a job and multiple benefits (using their id)
    static async addBenefits(pool, job_id, benefits){
        try{

            // Example Input: benefits = [1,3]

            // Check if there are types to add
            if (benefits.length === 0) {
                return "No benefits provided";
            }

             // Reference help: CHATGPT 4
            let positions = benefits.map((benefit_id, index) => `($1, $${index + 2})`).join(", "); 
            // End reference
            // Above, $1 is a constant so that doesn't get increased with each benefit.
            // We are adding 2 indexes with every row added for benefit_id.

            const query = `
                INSERT INTO job_benefits (job_id, benefit_id)
                VALUES ${positions}
                RETURNING job_id, benefit_id;
            `;

            const params = [job_id].concat(benefits); // Joining arrays

            
            const result = await pool.query(query, params);

            if (result){

                return result;
            }
            else{
                return false;
            }


        }catch(err){

            throw err;
        }
    }

    // Get all benefits that is under that job id.
    static async getBenefitsByJob(pool, job_id){
        try {
           
            const query = `
                SELECT benefits.* FROM benefits
                INNER JOIN job_benefits ON benefits.id = job_benefits.benefit_id
                WHERE job_benefits.job_id = $1;
            `;


            const params = [job_id];
    
            const result  = await pool.query(query, params);

            // returns array of benefit(s).
            return result.rows;

        } catch (err) {

            throw err; 
        }

    }



    // ======================================JOB QUESTIONS=============================================================

    // Give an array of question objectss and it will be attached to a job id.
    static async createQuestions(pool, job_id, questions){
        try{

            // Example Input expectation:
            //  questions = [{ question: 'Fake Question', reponse_type: 'text', is_req: 'true'}, 
            //               { question: 'Fake Question', reponse_type: 'text', is_req: 'true'}];

            // Check if there are questions to add
            if (questions.length === 0) {
                throw new Error("No questions provided");
            }

            
            let query = `
                INSERT INTO job_questions (job_id, question, response_type, is_req) VALUES 
            `;

            const positions = []; // Array for values positions
            const params = [];

            // Reference help: CHATGPT 4
            questions.forEach((question, index) => {
        
                const position_count = index * 4 + 1; // Starting $1, multiply 4 to suggest new row, add 1 since sql is 1-indexed.
                positions.push(`($${position_count}, $${position_count + 1}, $${position_count + 2}, $${position_count + 3})`);

                params.push(job_id, question.question, question.response_type, question.is_req === 'true'); // make sure is_req is boolean
            });
            // End reference

            query += positions.join(", ");
            query += ' RETURNING id';

            const result = await pool.query(query, params);

            if(result){

                return result.rows;
            }
            else{

                return false;
            }


        }catch(err){
            throw err;
        }

    }


    static async getQuestionsByJob(pool, job_id){
        try {

            const query = `
                SELECT * FROM job_questions WHERE job_id = $1;
            `;
            
            const params = [job_id];
            const result = await pool.query(query, params);

            // Returns array of questions
            if(result){

                return result.rows;
            }
            else{
                return false;
            }

        } catch(err) {

            throw err;
        }
    }

    // ====================================JOB SKILLS====================================================================

    
    // Create skills for a job id
    static async createSkills(pool, job_id, skills){

        try{

            // Example Input expectation:
            //  skills = [skill1, skill2];

            // Check if there are types to add
            if (skills.length === 0) {
                return "No skills provided";
            }

             // Reference help: CHATGPT 4
            let positions = skills.map((skill, index) => `($1, $${index + 2})`).join(", "); 
            // End reference
            // Above, $1 is a constant so that doesn't get increased with each skill.
            // We are adding 2 indexes with every row added for skill.

            const query = `
                INSERT INTO job_skills (job_id, name)
                VALUES ${positions}
                RETURNING id;
            `;

            const params = [job_id].concat(skills); // Joining arrays

            
            const result = await pool.query(query, params);

            if (result){

                return result;
            }
            else{
                return false;
            }


        }catch(err){
            throw err;
        }

    }

    static async getSkillsByJob(pool, job_id){
        try {

            const query = `
                SELECT * FROM job_skills WHERE job_id = $1;
            `;
            
            const params = [job_id];
            const result = await pool.query(query, params);

            // Returns array of questions
            if(result){

                return result.rows;
            }
            else{
                return false;
            }
            
        } catch(err) {
            
            throw err;
        }
    }

}

module.exports = Job;
