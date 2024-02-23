const db = require("./database");

function get_query_database(query, response, error_message) {
    db.query(query, (err, results) => {
        if (err) {
            response.status(500).send(error_message);
            console.error(error_message + ":", err);
            return;
        }
        response.json(results);
    });
}

function post_query_database(
    query,
    response,
    error_message,
    sucess_message = "Posted data Successfully"
) {
    db.query(query, (err, results) => {
        if (err) {
            response.status(500).send(error_message);
            console.error(error_message + ":", err);
            return;
        }
        response.json(sucess_message);
    });
}

module.exports = { get_query_database, post_query_database };
