class Seeker {

    constructor(user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry) {
        this.user_id = user_id;
        this.f_name = f_name;
        this.l_name = l_name;
        this.d_o_b = d_o_b;
        this.bio = bio;
        this.country = country;
        this.postcode = postcode;
        this.ct_phone = ct_phone;
        this.ct_email = ct_email;
        this.industry = industry;
    }

    // Create details for a seeker with user_id as foreign key.
    static async create(pool, user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry){
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
                INSERT INTO seekers(user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING user_id`;

            const params = [user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry];
            const result = await pool.query(query, params);

            return result.rows[0].user_id;
            }  
        }   
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    
    }


    // Returns user's seeker details in the form of User Object by inputting user id.
    static async getById(pool, id){
        try{
            const query = `
                SELECT user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry 
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


                return new Seeker(
                    seeker.user_id,
                    seeker.f_name,
                    seeker.l_name,
                    seeker.d_o_b,
                    seeker.bio,
                    seeker.country,
                    seeker.postcode,
                    seeker.ct_phone,
                    seeker.ct_email,
                    seeker.industry
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


}

module.exports = Seeker;
