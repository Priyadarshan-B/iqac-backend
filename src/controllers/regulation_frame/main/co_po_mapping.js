const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_co_po_mapping = (req, res) => {
    let course = req.query.course;

    const query = `SELECT 
    co.id, 
    CONCAT(co.co_id, '-', co.description) AS course_outcome, 
    CONCAT(po.code_name, '-', po.description) AS program_outcome, 
    mcp.mapping_level
    FROM 
        mapping_co_po mcp
    INNER JOIN 
        course_outcome co ON co.id = mcp.course_outcome
    INNER JOIN 
        outcome po ON po.id = mcp.program_outcome
    WHERE 
        co.course = ${course} AND mcp.status= '1';
    `;

    const error_message = "Failed to fetch CO PO mapping details";
    get_query_database(query, res, error_message);
};

exports.post_co_po_mapping = (req, res) => {
    const mappings = req.body;

    if (!Array.isArray(mappings) || mappings.length === 0) {
        return res.status(400).json({
            error: "Mappings should be a non-empty array.",
        });
    }

    const values = mappings.map(mapping => {
        const { course_outcome, program_outcome, mapping_level } = mapping;

        if (!course_outcome || !program_outcome || !mapping_level) {
            return res.status(400).json({
                error: "CO, PO, and mapping level are required fields.",
            });
        }

        return `(${course_outcome}, ${program_outcome}, ${mapping_level}, '1')`;
    }).join(', ');

    const query = `INSERT INTO mapping_co_po (course_outcome, program_outcome, mapping_level, status)
                   VALUES ${values}`;
    const error_message = "Failed to add CO and PO map";
    const success_message = "CO and PO added Successfully";

    post_query_database(query, res, error_message, success_message);
};

