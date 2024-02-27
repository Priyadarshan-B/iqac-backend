const { get_query_database } = require("../../../config/database_utils");

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

    const error_message = "Failed to fetch CO PO mapping details"
    get_query_database(query, res, error_message);
};

// exports.post_co_po_mapping = (req, res)=>{

// }
