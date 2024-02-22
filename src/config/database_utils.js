const db = require("./database");

function query_database(query, response, error_message) {
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(error_message);
            console.error(error_message + ":", err);
            return;
        }
        response.json(results);
    });
}

module.exports = { query_database };
