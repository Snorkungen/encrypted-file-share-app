import { Pool, Client } from "pg";

const pool = new Pool();

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})

export default pool;