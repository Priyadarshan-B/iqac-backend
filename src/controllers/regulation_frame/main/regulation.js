const { post_query_database } = require("../../../config/database_utils");

exports.post_regulation = (req, res) => {
    const {regulation} = req.body;
    if (!regulation) {
        res.status(400).json({
            error: "Regulation is required",
        });
    }
    const query = `INSERT INTO master_regulation (regulation, status)
    VALUES (${regulation}, '1')`;
    console.log(query);
    const error_message = "Error adding regulation";
    const success_message = "Regulation added Successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.update_regulation = (req, res) => {
    const { id, regulation } = req.body;
    if (!id || !regulation) {
        res.status(400).json({
            error: "Id and Regulation is required",
        });
    }
    const query = `UPDATE master_regulation 
    SET regulation = ${regulation}
    WHERE id = ${id}`;
    const error_message = "Error updating regulation";
    const success_message = "Regulation updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_regulation = (req, res) => {
    const id = req.body;
    if (!id) {
        res.status(400).json({
            error: "Id is required",
        });
    }
    const query = `UPDATE master_regulation
    SET status = '0'
    WHERE id = ${id}`;
    const error_message = "Error deleting regulation";
    const success_message = "Regulation deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
