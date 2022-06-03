
const pg = require('pg');
const pool = new pg.Pool({
    user: "jona",
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'banco_digital',
});
async function register_user(user_data) {
    const consultas = {
      text: 'INSERT INTO cliente (name, email, rut, address, password) VALUES ($1, $2, $3, $4, $5)',
      values: Object.values(user_data),
    };
    try {
      await pool.query(consultas);
    } catch (error) {
      console.log(error.message);
    }
  }
  
async function login(user_data) {
    const consultas = { 
        text: 'SELECT * FROM cliente WHERE rut = $1 and password = $2',
        values: Object.values(user_data)
    };
    try {
        const resp = await pool.query(consultas);
        return resp;
        
    } catch (error) {
        console.log(error.message);
      }
    }
//exportar modulos
module.exports = {register_user,login}