const { get_query_database } = require("../../../config/database_utils");

exports.get_branch = (req, res) => {
    let degree = req.query.degree;
    const query = `
        SELECT id, branch 
        FROM master_branch  
        WHERE degree = ${degree} AND status='1';`;
    const error_message = 'Error fetching branches';

    get_query_database(query, res, error_message);
};
