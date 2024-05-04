const mysql = require('mysql');

// Create MySQL connection pool
const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  // insecureAuth : true
});
// Function to execute SQL query
// function executeQuery(sql, values, callback) {
//   conn.connect((err, connection) => {
//     if (err) {
//       console.error('Error getting MySQL connection:', err);
//       return callback(err);
//     }
//     connection.query(sql, values, (error, results) => {
//       connection.release(); // Release the connection
//       if (error) {
//         console.error('Error executing SQL query:', error);
//         return callback(error);
//       }
//       callback(null, results);
//     });
//   });
// }
function executeQuery(sql, values, callback) {
  conn.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      return callback(error);
    }
    callback(null, results);
  });
}

// Function to select data from a table
// function selectData(table, callback) {
//   const sql = `SELECT * FROM ${table}`;
//   executeQuery(sql, null, callback);
// }

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

// Function to insert data into a table
// data should be in the form of object 
// const newUser = { username: 'john_doe', email: 'john@example.com' };

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

module.exports = {
  executeQuery,
  selectData,
  insertData,
  updateData,
  deleteData
};
