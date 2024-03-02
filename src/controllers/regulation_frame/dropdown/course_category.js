const { get_query_database } = require("../../../config/database_utils");

exports.get_course_category = (req, res) => {
    const query = `SELECT id, name 
    FROM course_category
    WHERE status ='1'`;
    const error_message = "Failed to fetch course category";
    get_query_database(query, res, error_message);
};
