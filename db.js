// import dotenv from 'dotenv';
// dotenv.config();  

// import { Pool } from 'pg';

// const pool = new Pool({
//   user:     process.env.PG_USER,      // matches PG_USER
//   password: process.env.PG_PASSWORD,  // matches PG_PASSWORD
//   host:     process.env.PG_HOST,      // matches PG_HOST
//   port:     Number(process.env.PG_PORT), // convert string → number
//   database: process.env.PG_DATABASE,  // matches PG_DATABASE
// });


// export default pool;


import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;