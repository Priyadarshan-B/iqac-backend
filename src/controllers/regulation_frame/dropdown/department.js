const { query_database } = require("../../../config/database_utils");

exports.get_department = (req, res) => {
    const query = `SELECT id, dep_name FROM master_departments`;
    const error_message = 'Error fetching departments';

    query_database(query, res, error_message);
};
