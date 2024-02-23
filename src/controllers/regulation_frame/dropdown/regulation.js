const { query_database } = require("../../../config/database_utils");

exports.get_regulation = (req, res) => {
    const query = `SELECT id, regulation FROM master_regulation`;
    const error_message = 'Error fetching regulations';

    query_database(query, res, error_message);
};
