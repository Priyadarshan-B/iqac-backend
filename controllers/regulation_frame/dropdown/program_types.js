const { get_query_database } = require("../../../config/database_utils");

exports.get_program_types = (req, res) => {
    const query = `SELECT id, type
    FROM program_type
    WHERE status = '1'`;
    const error_message = "Error fetching Program types";
    
    get_query_database(query, res, error_message);
};
