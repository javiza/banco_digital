
const pg = require('pg');
const Pool = pg.Pool({
    user: "jona",
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: banco_digital,
});
async function register_user(user) {
    const values = Object.values(user);
    const consulta = "";
    try {
        await Pool.query('BEGIN');
    } catch (error) {
        await Pool.query('ROLLBACK');
        console.log(error.message)
    }

}