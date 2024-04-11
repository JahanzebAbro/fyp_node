class Employer {

    // 1. user_id 
    // 2. name 
    // 3. size 
    // 4. bio 
    // 5. website 
    // 6. profile_pic 
    // 7. address
    // 8. postcode 
    // 9. ct_phone 
    // 10. ct_email 
    // 11. industry

    constructor(user_id, name, size, bio, website, profile_pic, address, postcode, ct_phone, ct_email, industry) {
        this.user_id = user_id;
        this.name = name;
        this.size = size;
        this.bio = bio;
        this.website = website;
        this.profile_pic = profile_pic;
        this.address = address;
        this.postcode = postcode;
        this.ct_phone = ct_phone;
        this.ct_email = ct_email;
        this.industry = industry;
    }

    static async create(
        pool, 
        user_id, 
        name, 
        size, 
        bio, 
        website, 
        profile_pic, 
        address, 
        postcode, 
        ct_phone, 
        ct_email, 
        industry) {
        try {

            const user_query = `SELECT * FROM employers WHERE user_id = $1`;
            const user_params = [user_id];

            let is_profile_existing = await pool.query(user_query, user_params);
            
            if (is_profile_existing.rows.length > 0) {
                // user who instantiated profile already exists
                return null;
            } 
            else {

                const query = `
                    INSERT INTO employers(user_id, name, size, bio, website, profile_pic_file, address, postcode, ct_phone, ct_email, industry)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    RETURNING user_id`;

                const params = [user_id, name, size, bio, website, profile_pic, address, postcode, ct_phone, ct_email, industry];
                const result = await pool.query(query, params);

                return result.rows[0].user_id;
            }  
        } 
        catch (err) {
            throw err;
        }
    }

    // Returns user's employer details in the form of User Object by inputting user id.
    static async getById(pool, id) {
        try {
            const query = `
                SELECT user_id, name, size, bio, website, profile_pic_file, address, postcode, ct_phone, ct_email, industry 
                FROM employers 
                WHERE user_id = $1;
            `;
            
            const params = [id];
    
            let query_result = await pool.query(query, params);
            let employer = query_result.rows[0];
    
            if (employer) {

                 // Aligning variable names.
                 employer.profile_pic = employer.profile_pic_file;

                return new Employer(
                    employer.user_id,
                    employer.name,
                    employer.size,
                    employer.bio,
                    employer.website,
                    employer.profile_pic,
                    employer.address,
                    employer.postcode,
                    employer.ct_phone,
                    employer.ct_email,
                    employer.industry
                );
            } else {
                return null;
            }
        }
        catch(err){
            throw err;
        }
    }


    // Update employer rows partially with a fields object containing name and value for the entry.
    static async update(pool, user_id, fields) {
        try {

            const set_columns = [];
            const params = [];

            Object.entries(fields).forEach(([column, value], index) => {
                set_columns.push(`${column} = $${index + 1}`);
                params.push(value);
            });
            
            params.push(user_id);

            // Check if anything to update.
            if (set_columns.length === 0) {
                return 'Nothing to update';
            }

            const query = `
                UPDATE employers
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
}

module.exports = Employer;

