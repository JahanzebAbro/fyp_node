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


    static async create(pool, user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry){
        try {


            const query = `
                INSERT INTO seekers(user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING user_id`;

            const params = [user_id, f_name, l_name, d_o_b, bio, country, postcode, ct_phone, ct_email, industry];
            const result = await pool.query(query, params);

            return result.rows[0].id;  
        }   
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    
    }


}

module.exports = Seeker;
