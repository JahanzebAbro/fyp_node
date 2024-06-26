class Seeker {

    // 1. user_id 
    // 2. f_name
    // 3. l_name
    // 4. gender
    // 5. d_o_b 
    // 6. bio 
    // 7. cv 
    // 8. profile_pic 
    // 9. address 
    // 10. postcode
    // 11. ct_phone
    // 12. ct_email
    // 13. industry 
    // 14. work_status 


    constructor(user_id, f_name, l_name, gender, d_o_b, bio, cv, profile_pic, address, postcode, ct_phone, ct_email, industry, work_status) {
        this.user_id = user_id;
        this.f_name = f_name;
        this.l_name = l_name;
        this.gender = gender;
        this.d_o_b = d_o_b;
        this.bio = bio;
        this.cv = cv;
        this.profile_pic = profile_pic;
        this.address = address;
        this.postcode = postcode;
        this.ct_phone = ct_phone;
        this.ct_email = ct_email;
        this.industry = industry;
        this.work_status = work_status;
    }

    // Create details for a seeker with user_id as foreign key.
    static async create(
        pool, 
        user_id, 
        f_name, 
        l_name,
        gender, 
        d_o_b, 
        bio, 
        cv, 
        profile_pic, 
        address, 
        postcode, 
        ct_phone, 
        ct_email, 
        industry, 
        work_status){
        try {

            const user_query = `SELECT * FROM seekers WHERE user_id = ($1)`;
            const user_params = [user_id];

            let is_profile_existing = await pool.query(user_query, user_params);
            
            if(await is_profile_existing.rows.length > 0){
                // user who instantiated profile already exists
                return null
            }
            else{

                const query = `
                    INSERT INTO seekers(user_id, f_name, l_name, gender, d_o_b, bio, cv_file, profile_pic_file, address, postcode, ct_phone, ct_email, industry, work_status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING user_id`;

                const params = [user_id, f_name, l_name, gender, d_o_b, bio, cv, profile_pic, address, postcode, ct_phone, ct_email, industry, work_status];
                const result = await pool.query(query, params);

                return result.rows[0].user_id;
            }  
        }   
        catch(err){
            throw err;
        }
    
    }


    // Returns user's seeker details in the form of User Object by inputting user id.
    static async getById(pool, id){
        try{
            const query = `
                SELECT user_id, f_name, l_name, gender, d_o_b, bio, cv_file, profile_pic_file, address, postcode, ct_phone, ct_email, industry, work_status 
                FROM seekers 
                WHERE user_id = $1;
            `;
            
            const params = [id];
    
            let query_result = await pool.query(query, params);
            let seeker = query_result.rows[0];
    
            

            if (seeker) {

                // FORMAT DATE FOR DISPLAY
                let date = seeker.d_o_b;
                const pad = (number) => number.toString().padStart(2, '0'); // Adds leading zero if single digit
        
                const day = pad(date.getDate());
                const month = pad(date.getMonth() + 1); // Months are 0-indexed
                const year = date.getFullYear();
                
                seeker.d_o_b = `${day}/${month}/${year}`;

                // Aligning variable names.
                seeker.profile_pic = seeker.profile_pic_file;
                seeker.cv = seeker.cv_file;

                return new Seeker(
                    seeker.user_id,
                    seeker.f_name,
                    seeker.l_name,
                    seeker.gender,
                    seeker.d_o_b,
                    seeker.bio,
                    seeker.cv,
                    seeker.profile_pic,
                    seeker.address,
                    seeker.postcode,
                    seeker.ct_phone,
                    seeker.ct_email,
                    seeker.industry,
                    seeker.work_status
                );
            } else {
                return null;
            }
        }
        catch(err){
            throw err;
        }

    }

    // Update seeker rows partially with a fields object containing name and value for the entry.
    static async update(pool, user_id, fields){
        try{
            
            const set_columns = [];
            const params = [];

            Object.entries(fields).forEach(([column, value], index) => {
                set_columns.push(`${column} = $${index + 1}`); // SQL params index start at 1
                params.push(value);
            });
            
            params.push(user_id);

            // Check if anything to update.
            if (set_columns.length === 0) {
                return 'Nothing to update';
            }

            const query = `
                UPDATE seekers
                SET ${set_columns.join(', ')}
                WHERE user_id = $${set_columns.length + 1}
                RETURNING *;
            `; 

            
            const result = await pool.query(query, params);

            if (result.rows.length > 0) {
                return result.rows[0].user_id;
            } else {
                return null; 
            }


        }
        catch(err){
            throw err;
        }
    }


    static async getApplicationCount(pool, seeker_id){

        try{
            const query = `
                SELECT COUNT(*)
                FROM applications
                WHERE seeker_id = $1
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);
            
            if(result){
                return result.rows[0].count;
            }
            else{
                return 0;
            }

        }
        catch(err){
            throw err;
        }
    }


    static async getApplicationRate(pool, seeker_id){

        try{
            const query = `
                SELECT SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as count, DATE(created_at) as date
                FROM applications
                WHERE seeker_id = $1
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at) ASC;
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);
            
            if(result){
                return result.rows;
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }
    }


    static async getApplicationStatusCount(pool, seeker_id){

        try{
            const query = `
                SELECT status, COUNT(status) AS count
                FROM applications
                WHERE seeker_id = $1
                GROUP BY status
                ORDER BY status ASC
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);
            
            if(result){
                return result.rows;
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }
        
    }


    static async getSavedApplyRatio(pool, seeker_id){

        try{
            const query = `
                SELECT sj.job_id, a.id as application_id
                from saved_jobs sj
                INNER JOIN 
                    jobs j ON j.id = sj.job_id
                LEFT JOIN 
                    applications a ON sj.job_id = a.job_id AND sj.seeker_id = a.seeker_id
                WHERE sj.seeker_id = $1;
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);

            let applied_count = 0;
            result.rows.forEach(function (item) {
                applied_count += item.application_id ? 1 : 0; // Add one if not null
            });

            let not_applied_count = result.rows.length - applied_count;

            if(result){
                return {applied: applied_count, not_applied: not_applied_count};
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }

    }


    static async getFavoriteIndustries(pool, seeker_id){

        try{
            const query = `
                WITH interested_jobs AS (
                    SELECT job_id FROM applications WHERE seeker_id = $1
                    UNION
                    SELECT job_id FROM saved_jobs WHERE seeker_id = $1
                )
                SELECT e.industry, COUNT(e.industry) as count
                FROM interested_jobs ij
                JOIN jobs j ON ij.job_id = j.id
                JOIN employers e ON e.user_id = j.user_id
                GROUP BY e.industry
                ORDER BY count DESC;
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);

            // const industryNames = result.rows.map(row => row.industry);
            
            if(result){
                return result.rows;
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }

    }


    // Increment view count everytime job is viewed
    static async addView(pool, seeker_id){

        try{
            const query = `
                INSERT INTO seeker_views (seeker_id, view_date, view_count)
                VALUES ($1, CURRENT_DATE, 1)
                ON CONFLICT (seeker_id, view_date) DO UPDATE
                SET view_count = seeker_views.view_count + 1
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);
            
            if(result){
                return result.rows[0];
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }

    }


    static async getViews(pool, seeker_id){

        try{
            const query = `
                SELECT view_count, view_date 
                FROM seeker_views 
                WHERE seeker_id = $1
            `;
            
            const params = [seeker_id];
    
            let result = await pool.query(query, params);
            
            if(result){
                return result.rows;
            }
            else{
                return [];
            }

        }
        catch(err){
            throw err;
        }

    }
}

module.exports = Seeker;
