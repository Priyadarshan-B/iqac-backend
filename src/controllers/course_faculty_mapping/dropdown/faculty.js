const { query_database } = require("../../../config/database_utils");

exports.get_faculty = (req, res) =>{
    let department_id = req.query.department
    const query = `SELECT id, CONCAT(user_id, '-' ,user_name) faculty_name
    FROM master_user 
    WHERE user_type = 'faculty' AND  dep_id = ${department_id}`;
    const error_message = 'Error fetching Faculty';

    query_database(query, res, error_message);
}