const db = require("../config/database");

exports.getYear = (req,res)=>{
    const query = `SELECT id,year FROM master_year`;
    db.query(query,(err,rows)=>{
        if(err){
            res.status(500).send("Unable to fetch years")
            console.log("Unable to fetch years")
        }
        else{
            res.json(rows)
        }
    })
}