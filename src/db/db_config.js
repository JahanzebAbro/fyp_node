// Pool as in connection.
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password:"Y80itbA0",
    host: "localhost",
    port: 5432,
    database: "fyp_recruit"
});

module.exports = pool;