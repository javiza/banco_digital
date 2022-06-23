const pg = require('pg');
const pool = new pg.Pool({
  user: "jona",
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'gestion',
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

async function admin(user_data) {
  const consultas = {
    text: 'SELECT * FROM admin WHERE rut = $1 and password = $2',
    values: Object.values(user_data)
  };
  try {
    const resp = await pool.query(consultas);
    return resp;

  } catch (error) {
    console.log(error.message);
  }
}
async function getAllTransfers() {
  const consultas = {
    text: 'SELECT t.fecha, c.name as origen, d.name as destino, t.monto FROM transfer t left join cliente c on t.id_cliente = c.id left join cliente d on t.id_destinatario = d.id',
  };
  try {
    const resp = await pool.query(consultas);
    return resp.rows;
  } catch (error) {
    console.log(error.message);
  }
}
async function getAllUsers() {
  const consultas = {
    text: 'SELECT id, name, balance FROM cliente',
  };
  try {
    const resp = await pool.query(consultas);
    return resp.rows;
  } catch (error) {
    console.log(error.message);
  }
}
async function getDatoUsers(){
  const consultas = {
    text: 'SELECT id, name, email, rut, address, balance FROM cliente',
  };
  try {
    const resp = await pool.query(consultas);
    return resp.rows;
  } catch (error) {
    console.log(error.message);
  }
}

async function newTransfer(data_transfer) {
  const consultas = {
    text: 'INSERT INTO transfer (id_cliente, id_destinatario, monto, comment) VALUES ($1, $2, $3, $4)',
    values: Object.values(data_transfer),
  };

  const { id_cliente, id_destinatario, monto } = data_transfer;
  const removeMoney = {
    text: 'UPDATE cliente SET balance = balance - $2 WHERE id = $1',
    values: [id_cliente, monto],
  };

  const addMoney = {
    text: 'UPDATE cliente SET balance = balance + $2 WHERE id = $1',
    values: [id_destinatario, monto],
  };
  try {
    // return await pool.query(consultas);
    await pool.query('BEGIN');
    await pool.query(consultas);
    await pool.query('COMMIT');
    await pool.query(removeMoney);
    await pool.query('COMMIT');
    await pool.query(addMoney);
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.log(error.message);
  }
}
//eliminar cliente


async function borrar(id) {
  try {
      const result = await pool.query(`DELETE FROM cliente WHERE id ='${id}'`);
      return result.rowCount;
  } catch (error) {
    console.log(error.message);
  }
}
//exportar modulos
module.exports = {
  register_user,
  login,getAllTransfers,getAllUsers,newTransfer,getDatoUsers,admin,borrar,
}