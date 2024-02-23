const { query_database } = require("../../../config/database_utils");

exports.get_branch = (req, res) => {
    let regulation = req.query.regulation;
    const query = `
        SELECT mb.id, mb.branch 
        FROM master_branch mb  
        INNER JOIN branch_regulation_mapping bmr ON mb.id = bmr.branch
        WHERE bmr.regulation = ${regulation};`;
    const error_message = 'Error fetching branches';

    query_database(query, res, error_message);
};
