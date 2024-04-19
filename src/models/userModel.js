
class User {

    constructor(id, email, password, user_type) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.user_type = user_type;
    }

    // Create User, password must be hashed before.
    static async create(pool, email, password, user_type) {
        try {

            const email_query = `SELECT * FROM users WHERE email = ($1)`;
            const email_params = [email];

            let is_email_existing = await pool.query(email_query, email_params);
            
            if(await is_email_existing.rows.length > 0){
                // email exists
                return null
            }
            else{
                const query = 
                `INSERT INTO users(email, password, user_type) VALUES ($1, $2, $3) RETURNING id`;
                
                const params = 
                [email, password, user_type];
            
                let query_result = await pool.query(query, params);

                return query_result.rows[0].id; 
            }              
        }   
        catch(err){
            // console.log('Query problem');
            throw err;
        }
    
    }




    // Returns user account details in the form of User Object by inputting user id.
    static async getById(pool, id){
        try{

            const query = 
            `SELECT id, email, password, user_type FROM users WHERE id = ($1);`;
            
            const params =
            [id];

            let query_result = await pool.query(query, params);
            let user = query_result.rows[0];

            if (user) {
                return new User(
                    user.id,
                    user.email,
                    user.password,
                    user.user_type
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




    // Returns user account details in the form of User Object by inputting email.
    static async getByEmail(pool, email){
        try{

            const query = 
            `SELECT id, email, password, user_type FROM users WHERE email = ($1);`;
            
            const params =
            [email];

            let query_result = await pool.query(query, params);
            let user = query_result.rows[0];

            if (user) {
                return new User(
                    user.id,
                    user.email,
                    user.password,
                    user.user_type
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




    // Change password by provided the id of user and the new desired password.
    static async changePasswordById(pool, id, new_password){
        //WIP
    }


    
}

module.exports = User;


