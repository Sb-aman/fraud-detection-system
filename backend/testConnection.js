require("dotenv").config();

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_NAME);


const pool = require("./config/db");

async function test() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL Pool Connected Successfully");
        connection.release();
    } catch (err) {
        console.log(err);
    }
}

test();