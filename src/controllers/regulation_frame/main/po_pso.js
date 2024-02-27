const {
    get_query_database,
    post_query_database,
} = require("../../../config/database_utils");

exports.get_po_pso = (req, res) => {
    const query = `SELECT id, CONCAT(code_name,'-',description) name
        FROM outcome 
        WHERE status = '1'`;
    const error_message = "Error fetching PO and PSO's";

    get_query_database(query, res, query, error_message);
};

exports.post_po_pso = (req, res) => {
    const { type, code_name, description } = req.body;
    if (!type || !code_name || !description) {
        res.status(400).json({
            error: "Fields 'type', 'code_name', and 'description' are required",
        });
    }
    const query = `INSERT INTO outcome(type, code_name, description, status)
    VALUES(${type}, ${code_name}, ${description}, '1')`;
    const error_message = "Failed to Add PO/PSO";
    const success_message = "PO/PSO Added successfully";

    post_query_database(query, res, error_message, success_message);
};

const { post_query_database } = require("../../../config/database_utils");

exports.update_po_pso = (req, res) => {
    const { id, type, code_name, description } = req.body;
    if (!id || !type || !code_name || !description) {
        res.status(400).json({
            error: "Fields 'id', 'type', 'code_name', and 'description' are required",
        });
    }
    const query = `UPDATE outcome
    SET type = ${type}, code_name = ${code_name}, description = ${description}
    WHERE id = ${id}`;
    const error_message = "Failed to update PO/PSO";
    const success_message = "PO/PSO Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_po_pso = (req, res) => {
    const id = req.body;
    if (!id) {
        res.status(400).json({
            error: "ID is required",
        });
    }
    const query = `UPDATE outcome
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete PO/PSO";
    const success_message = "PO/PSO Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
