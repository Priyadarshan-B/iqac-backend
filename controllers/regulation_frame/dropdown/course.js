const { get_query_database } = require("../../../config/database_utils");

exports.get_courses = (req, res) => {
    let branch = req.query.branch;
    let semester = req.query.semester;
    const query = `
    SELECT id, CONCAT(code,'-',name) course FROM master_courses 
    WHERE branch = ${branch} AND semester = ${semester} AND status ='1'`;
    const error_message = "Error Fetching courses";

    get_query_database(query, res, error_message);
};
