const db = require("../../../config/database");

exports.get_branch = (req, res) => {
    let regulation = req.query.regulation;
    const query = `
        SELECT mb.id, mb.branch 
        FROM master_branch mb  
        INNER JOIN branch_regulation_mapping bmr ON mb.id = bmr.branch
        WHERE bmr.regulation = ${regulation};`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Error retrieving branch");
            console.error("Error retrieving branches:", err);
            return;
        }
        res.json(results);
    });
};
