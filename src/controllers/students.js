const db = require("../config/database");

exports.getStudents = (req,res)=>{
    let query;
    if(req.query.branch && req.query.year && req.query.course){
     query = `SELECT ms.id,ms.name,ms.register_number FROM master_students ms INNER JOIN master_courses mc ON mc.branch = ms.department  WHERE mc.branch = ${req.query.branch} AND ms.year =${req.query.year} AND mc.id = ${req.query.course} GROUP BY ms.id`
    }
    else{
         query = `SELECT id,name FROM master_students`
    }
    db.query(query,(err,rows)=>{
        if(err){
            res.status(500).send("Cannot Fetch Students")
            console.log("Cannot Fetch Students")
        }
        else{
            res.json(rows)
        }
    })
}