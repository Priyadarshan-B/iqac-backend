const { get_query_database } = require('../../../config/database_utils');


exports.get_academic_years = (request, response) => {
    const query = `SELECT id, year FROM academic_year`;
    const error_message = "Error fetching academic years";

    get_query_database(query, response, error_message);
};