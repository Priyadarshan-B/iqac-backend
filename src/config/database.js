const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "vishnu",
    password: "vishnu",
    database: "iqac",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("MySQL connected");
});

module.exports = db;
