const mysql = require('mysql');

//#region Database Connection
const db = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'test',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database!');
});
//#endregion Database Connectio
module.exports = db;
