const { post_query_database } = require("../../../config/database_utils");

exports.post_course = (req, res) => {
    const {
        branch,
        semester,
        code,
        name,
        lecture_hours,
        tutorial_hours,
        practical_hours,
        credit,
        hours_per_week,
        ca,
        es,
        total,
        category,
    } = req.body;
    if (
        !branch ||
        !semester ||
        !code ||
        !name ||
        !lecture_hours ||
        !tutorial_hours ||
        !practical_hours ||
        !credit ||
        !hours_per_week ||
        !ca ||
        !es ||
        !total ||
        !category
    ) {
        res.status(400).json({
            error: "Fields 'branch', 'semester', 'code', 'name', 'lecture_hours', 'tutorial_hours', 'practical_hours', 'credit', 'hours_per_week', 'ca', 'es', 'total', and 'category' are required",
        });
    }
    const query = `INSERT INTO master_courses(branch, semester, code, name, lecture_hours, tutorial_hours, practical_hours, credit, hours_per_week, ca, es, total, category, status)
    VALUES(${branch}, ${semester}, '${code}', '${name}', ${lecture_hours}, ${tutorial_hours}, ${practical_hours}, ${credit}, ${hours_per_week}, ${ca}, ${es}, ${total}, ${category}, '1')`;
    const error_message = "Failed to Add Course";
    const success_message = "Course Added successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.update_course = (req, res) => {
    const {
        id,
        branch,
        semester,
        code,
        name,
        lecture_hours,
        tutorial_hours,
        practical_hours,
        credit,
        hours_per_week,
        ca,
        es,
        total,
        category,
    } = req.body;
    if (
        !id ||
        !branch ||
        !semester ||
        !code ||
        !name ||
        !lecture_hours ||
        !tutorial_hours ||
        !practical_hours ||
        !credit ||
        !hours_per_week ||
        !ca ||
        !es ||
        !total ||
        !category
    ) {
        res.status(400).json({
            error: "Fields 'id', 'branch', 'semester', 'code', 'name', 'lecture_hours', 'tutorial_hours', 'practical_hours', 'credit', 'hours_per_week', 'ca', 'es', 'total', and 'category' are required",
        });
    }
    const query = `UPDATE master_courses
    SET branch = ${branch}, semester = ${semester}, code = '${code}', name = '${name}', lecture_hours = ${lecture_hours}, tutorial_hours = ${tutorial_hours}, practical_hours = ${practical_hours}, credit = ${credit}, hours_per_week = ${hours_per_week}, ca = ${ca}, es = ${es}, total = ${total}, category = ${category}
    WHERE id = ${id}`;
    const error_message = "Failed to update Course";
    const success_message = "Course Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_course = (req, res) => {
    const id = req.body;
    if (!id) {
        res.status(400).json({
            error: "Field 'id' is required",
        });
    }
    const query = `UPDATE master_courses
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete course";
    const success_message = "Course Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
