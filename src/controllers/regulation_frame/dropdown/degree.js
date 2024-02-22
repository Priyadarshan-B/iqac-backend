const { query_database } = require('../../../config/database_utils');

exports.get_degree = (request, response) => {
    let regulation = request.query.regulation;
    const query = `SELECT id, degree FROM master_degree WHERE regulation = ${regulation}`;
    const errorMessage = "Error retrieving Degree details";

    query_database(query, response, errorMessage);
};