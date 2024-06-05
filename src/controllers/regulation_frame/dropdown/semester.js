const { get_query_database } = require("../../../config/database_utils");

exports.get_semester = (req, res) => {
    const query = `SELECT id, semester FROM master_semester`;
    const error_message = 'Error fetching semester';
    get_query_database(query, res, error_message);
};
