const pgp = require('pg-promise')();
require('dotenv').config();


const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
console.log("Database Connected")

module.exports = db;