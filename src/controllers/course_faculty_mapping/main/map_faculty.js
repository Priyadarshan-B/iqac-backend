const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_mapped_faculty = (req, res) => {
    let course = req.query.course;
    let academic_year = req.query.academic_year;
    let query = `SELECT 
        fcm.id,
        ay.year, 
        CONCAT(mu.user_id, '-', mu.user_name) AS faculty_name, 
        CONCAT(mc.code, '-', mc.name) AS course_name
        FROM 
            faculty_course_mapping fcm
        INNER JOIN 
            academic_year ay ON fcm.year = ay.id
        INNER JOIN 
            master_user mu ON fcm.faculty = mu.id
        INNER JOIN 
            master_courses mc ON fcm.course = mc.id
        WHERE 
            fcm.status = '1'`;

    const error_message = "Error fetching mapped faculty";

    if (academic_year && course) {
        query += ` AND ay.id = ${academic_year} AND mc.id = ${course}`;
    }

    get_query_database(query, res, error_message);
};

exports.post_faculty_mapping = (req, res) => {
    const { academic_year, faculty_id, course_id } = req.body;
    if (!academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Academic year, faculty ID, and course ID are required.",
        });
    }
    const query = `
        INSERT INTO faculty_course_mapping (year, faculty, course, status)
        VALUES (${academic_year}, ${faculty_id}, ${course_id}, '1')
    `;
    const error_message = "Error mapping faculty to course.";
    const success_message = "Successfully mapped faculty to course";

    post_query_database(query, res, error_message, success_message);
};

exports.update_faculty_mapping = (req, res) => {
    const { mapping_id, academic_year, faculty_id, course_id } = req.body;

    if (!mapping_id || !academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Mapping ID, academic year, faculty ID, and course ID are required.",
        });
    }

    const query = `
        UPDATE faculty_course_mapping
        SET year = ${academic_year}, faculty = ${faculty_id}, course = ${course_id}
        WHERE id = ${mapping_id}
    `;
    const error_message = "Error updating faculty mapping.";
    const success_message = "Successfully updated faculty mapping.";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_faculty_mapping = (req, res) => {
    const mapping_id = req.body.mapping_id;
    if (!mapping_id) {
        return res.status(400).json({
            error: "Mapping ID is required.",
        });
    }

    const query = `
        UPDATE faculty_course_mapping
        SET status = '0'
        WHERE id = ${mapping_id}
    `;
    const error_message = "Error Deleting faculty mapping.";
    const success_message = "Successfully Deleted faculty mapping.";

    post_query_database(query, res, error_message, success_message);
};