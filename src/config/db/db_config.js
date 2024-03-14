const Pool = require("pg").Pool;
require('dotenv').config(); 

const conn = `postgresql://
${process.env.DB_USER}:
${process.env.DB_PASSWORD}@
${process.env.DB_HOST}:
${process.env.DB_PORT}/
${process.env.DB}`;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : conn
});

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release(); // Release the client back to the pool
  })

module.exports = pool;