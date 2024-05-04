// db.config.js
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testNodeJs'
});

function executeQuery(sql, values, callback) {
  conn.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      return callback(error);
    }
    callback(null, results);
  });
}

function selectData(table, condition, callback) {
  let sql = `SELECT * FROM ${table}`;
  const values = [];
  if (condition) {
    const conditions = Object.keys(condition).map(key => `${key} = ?`);
    sql += ` WHERE ${conditions.join(' AND ')}`;
    Object.values(condition).forEach(value => values.push(value));
  }
  executeQuery(sql, values.length ? values : null, callback);
}

function insertData(table, data, callback) {
  const sql = `INSERT INTO ${table} SET ?`;
  executeQuery(sql, data, callback);
}

// Function to update data in a table
function updateData(table, data, condition, callback) {
  const sql = `UPDATE ${table} SET ? WHERE ?`;
  executeQuery(sql, [data, condition], callback);
}

// Function to delete data from a table
function deleteData(table, condition, callback) {
  const sql = `DELETE FROM ${table} WHERE ?`;
  executeQuery(sql, condition, callback);
}

// module.exports = connection;

module.exports = {
  conn,
  executeQuery,
  selectData,
  insertData,
  updateData,
  deleteData
};
