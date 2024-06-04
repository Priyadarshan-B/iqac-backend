const db = require("../config/database");

exports.getCourseOutcome = (req,res)=>{

    if(req.query.course){
       const query =  `SELECT id FROM course_outcome WHERE course = ?`;
       db.query(query,[req.query.course],(err,rows)=>{
         if(err){
            res.status(500).send("Error in fetching Course Outcomes")
            console.log("Error in fetching Course Outcomes")
         }
         else{
            res.json(rows);
         }
       })
    }
    else{
         res.status(400).send("invalid course")
    }
}