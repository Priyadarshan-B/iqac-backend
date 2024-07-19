const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_course_outcome = (req, res) => {
  console.log("Im called")
  let course = req.query.course;
  console.log(course)
  const query = `SELECT id, CONCAT(co_id,'-',description) course_outcome
        FROM course_outcome 
        WHERE status = '1' AND course = ${course}`;
  const error_message = "Error fetching course outcomes";

  get_query_database(query, res, error_message, (res) => {
    console.log(res);
  });
};

exports.post_course_outcome = (req, res) => {
  const { course, co_id, description } = req.body;
  if (!course || !co_id || !description) {
    res.status(400).json({
      error: "Course, co id, and description are required"
    });
  }
  const query = `INSERT INTO course_outcome(course, co_id, description, status)
    VALUES (${course}, '${co_id}', '${description}', '1')`;
  const error_message = "Failed to insert course outcome";
  const success_message = "Course outcome added successfully";

  post_query_database(query, res, error_message, success_message);
};

exports.update_course_outcome = (req, res) => {
  const { id, course, co_id, description } = req.body;
  if (!id || !course || !co_id || !description) {
    res.status(400).json({
      error: "ID, Course, co id, and description are required"
    });
  }

  const query = `UPDATE course_outcome
    SET course = ${course}, co_id = '${co_id}', description = '${description}'
    WHERE id = ${id}`;
  const error_message = "Failed to update course outcome";
  const success_message = "Course outcome updated successfully";

  post_query_database(query, res, error_message, success_message);
};

exports.delete_course_outcome = (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({
      error: "ID is required"
    });
  }

  const query = `UPDATE course_outcome 
    SET status = '0'
    WHERE id = ${id}`;
  const error_message = "Failed to delete course outcome";
  const success_message = "Course outcome deleted successfully";

  post_query_database(query, res, error_message, success_message);
};
