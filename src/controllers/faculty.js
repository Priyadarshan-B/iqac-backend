const db = require("../config/database");

exports.getFaculty= (req,res)=>{
    const query = `SELECT id,name FROM master_faculty WHERE status = '1'`;
    db.query(query,(err,rows)=>{
        if(err){
            res.status(500).send('Error in retrieving faculty')
        }
        else{
            res.json(rows);
        }
    })
}