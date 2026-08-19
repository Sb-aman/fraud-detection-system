// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//     if (err) {
//         console.log( err);
//     } else {
//         console.log("MySQL Connected Successfully");
//     }
// });

// module.exports = connection;
require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// console.log("DB HOST:", process.env.DB_HOST);
// console.log("DB USER:", process.env.DB_USER);
// console.log("DB NAME:", process.env.DB_NAME);
// console.log("DB PASSWORD EXISTS:", !!process.env.DB_PASSWORD);

module.exports = pool;