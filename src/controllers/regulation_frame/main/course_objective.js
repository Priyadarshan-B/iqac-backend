const {
    get_query_database,
    post_query_database,
} = require("../../../config/database_utils");

exports.get_course_objective = (req, res) => {
    let course = req.query.course;
    const query = `SELECT co_obj_id, description 
    FROM course_objective 
    WHERE status = '1' AND course =${course}`;
    const error_message = "Error fetching Course objective";

    get_query_database(query, res, error_message);
};

exports.post_course_objective = (req, res) => {
    const { course, co_obj_id, description } = req.body;
    if (!course || !co_obj_id || !description) {
        res.status(400).json({
            error: "Course, co_obj_id, description is required",
        });
    }
    const query = `INSERT INTO course_objective(course, co_obj_id, description, status)
    VALUES (${course}, '${co_obj_id}', '${description}', '1')`;
    const error_message = "Failed to add course objective";
    const success_message = "Course objective is added successfully";
    post_query_database(query, res, error_message, success_message);
};

exports.update_course_objective = (req, res) => {
    const { id, course, co_obj_id, description } = req.body;
    if (!id || !course || !co_obj_id || !description) {
        res.status(400).json({
            error: "Fields 'id', 'course', 'co_obj_id', and 'description' are required",
        });
    }
    const query = `UPDATE course_objective
    SET course = ${course}, co_obj_id = '${co_obj_id}', description = '${description}'
    WHERE id = ${id}`;
    const error_message = "Failed to update Course Objective";
    const success_message = "Course Objective Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_course_objective = (req, res) => {
    const id  = req.body;
    if (!id) {
        res.status(400).json({
            error: "ID is required",
        });
    }
    const query = `UPDATE course_objective
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete Course Objective";
    const success_message = "Course Objective Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};


