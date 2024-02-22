const db = require("../../../config/database");

exports.get_academic_years = (req, res) => {
    const query = `SELECT id, year FROM academic_year`;
    
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Error retrieving academic years");
            console.error("Error retrieving academic years:", err);
            return;
        }
        res.json(results);
    });
};
