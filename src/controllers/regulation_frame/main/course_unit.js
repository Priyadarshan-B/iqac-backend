const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_course_unit = (req, res) => {
    let course = req.query.course;
    const query = `SELECT CONCAT(unit,'-',unit_name) AS unit_name, description, hours 
    FROM course_unit 
    WHERE course = ${course} AND status = '1'`;

    const error_message = "Error fetching course unit";
    get_query_database(query, res, error_message);
};

exports.post_course_unit =(req, res)=>{
    const {course, unit, unit_name, description, hours} = req.body
    if(!course || !unit ||!unit_name ||!description){
        res.status(400).json({
            error:"Course, unit, unit name, description and hours is required"
        })
    }
    const query = `INSERT INTO course_unit(course, unit, unit_name, description, hours, status)
    VALUES (${course}, '${unit}', '${unit_name}', '${description}', ${hours}, '1')`

    const error_message = "Failed to add course unit"
    const success_message = "Course unit added successfully"

    post_query_database(query, res, error_message, success_message)
}

exports.update_course_unit = (req, res) => {
    const { id, course, unit, unit_name, description, hours } = req.body;
    if (!id || !course || !unit || !unit_name || !description || !hours) {
        res.status(400).json({
            error: "Fields 'id', 'course', 'unit', 'unit_name', 'description', and 'hours' are required",
        });
    }
    const query = `UPDATE course_unit
    SET course = ${course}, unit = '${unit}', unit_name = '${unit_name}', description = '${description}', hours = ${hours}
    WHERE id = ${id}`;
    const error_message = "Failed to update Course Unit";
    const success_message = "Course Unit Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_course_unit = (req, res) => {
    const id = req.body.id;
    if (!id) {
        res.status(400).json({
            error: "ID is required",
        });
    }
    const query = `UPDATE course_unit
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete Course Unit";
    const success_message = "Course Unit Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
