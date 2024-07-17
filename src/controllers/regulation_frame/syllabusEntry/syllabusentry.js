const {get_query_database}  = require('../../../config/database_utils')

exports.get_syllabus = (req, res) =>{
    let course = req.query.course;
    const query = `
    SELECT unit, unit_name, description, hours
     FROM course_unit 
     WHERE course = ${course}
     AND status IN ('1');
    `
    const errorMessage = "Error fetching Syllabus details";
    get_query_database(query, res, errorMessage);

}