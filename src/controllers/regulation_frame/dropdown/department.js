const db = require("../../../config/database");

exports.get_department = (req, res) => {
    const query = "SELECT id, dep_name FROM master_departments";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Error retrieving academic years");
            console.error("Error retrieving academic years:", err);
            return;
        }
        res.json(results);
    });
};
