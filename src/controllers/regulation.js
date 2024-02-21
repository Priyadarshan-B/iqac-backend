const db = require("../config/database");

exports.getRegulation = (req, res) => {
  const query = "SELECT id, regulation FROM master_regulation";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving academic years");
      console.error("Error retrieving academic years:", err);
      return;
    }
    res.json(results);
  });
};
