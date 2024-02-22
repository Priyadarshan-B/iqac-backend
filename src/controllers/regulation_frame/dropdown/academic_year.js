const { query_database } = require('../../../config/database_utils');


exports.get_academic_years = (request, response) => {
    const query = `SELECT id, year FROM academic_year`;
    const errorMessage = "Error retrieving academic years";

    query_database(query, response, errorMessage);
};