const mysql = require('mysql2/promise');
// Create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'jmzapteria',
});
module.exports = connection;