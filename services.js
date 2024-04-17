const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DBNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
   
});

async function seeder() {
    const defaultNominees = ['Nominee 1', 'Nominee 2', 'Nominee 3', 'Nominee 4', 'Nominee 5'];
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS nominees');
    await client.query(`
    CREATE TABLE IF NOT EXISTS nominees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        votes INT DEFAULT 0
    )
    `);

    for (const nominee of defaultNominees) {
        await client.query('INSERT INTO nominees (name) VALUES ($1)', [nominee]);
    }

    await client.query('COMMIT');

    console.log('Default nominees seeded successfully');
    
    client.release();

}

async function getNomineesData() {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM nominees');

    const voteCounts = result.rows;

    client.release();

    return voteCounts;
}

async function vote(nomineeId) {
    const client = await pool.connect();
    await client.query('UPDATE nominees SET votes = votes + 1 WHERE id = $1', [nomineeId]);
    client.release();
}

async function countVotes(){
    const client = await pool.connect();
    const totalCount = await client.query('SELECT SUM(votes) FROM nominees');

    const voteCounts = totalCount.rows[0].sum;

    client.release();
    return voteCounts;
}

async function getAllNominees() {
    const client = await pool.connect();
    const result = await client.query('SELECT id,name FROM nominees');

    const nominees = result.rows;

    client.release();

    return nominees;
}

module.exports = {
    getNomineesData,
    vote,
    seeder,
    countVotes,
    getAllNominees
}