const db = require("../config/database");

exports.getDepartment = (req, res) => {
  let query;
  
  if(req.query.regulation){
    const regulation = Number(req.query.regulation)
    console
    query = `SELECT mb.id,mb.branch FROM master_branch mb INNER JOIN master_degree md ON md.id = mb.degree INNER JOIN master_regulation mr ON mr.id = md.regulation WHERE mr.id=${regulation}`
  }
  else{
    query = "SELECT id,branch FROM master_branch";

  }
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving departments");
      console.error("Error retrieving departments:", err);
      return;
    }
    res.json(results);
  });
};
