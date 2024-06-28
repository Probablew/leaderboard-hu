// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql8.srkhost.eu',
    user: 'u56240_PmpWTvuogc',
    password: '1v4x!@qm=3.sIcXM..I8f3yy',
    database: 's56240_Leaderboardhu'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
