const { response } = require("express");
const db = require("../config/database");


exports.updateMarks = (req, res) => {
    console.log(req.body);
  
    if (req.body.length === 0) {
      return res.status(500).send("Error in Adding Marks");
    }
  
    let errors = [];
  
    req.body.student.forEach((student) => {
      const type = student.type;
      const id = student.id;
      const update_query = `
        UPDATE mark_entry SET mark = ? WHERE student = ? AND type = ? AND co_id = ? AND NOT mark = ?
        `
        const insert_query = `INSERT INTO mark_entry (student,type,co_id,mark) VALUES (?,?,?,?)`

      student.marks.forEach((mark, i) => {
        const co = req.body.co[i].id;

        db.query(`SELECT COUNT(id) count FROM mark_entry WHERE student = ? AND type = ? AND co_id = ? LIMIT 1`,[id,type,co],(err,rows)=>{
          if(err){
            console.log(err)
          }
          else{
            if(rows[0].count>0){
              console.log(rows , " exists updating ..............")
              db.query(update_query,
                [mark,id, type, co, mark],
                (err) => {
                  if (err) {
                    console.log(err);
                    errors.push(err);
                  }
                }
              );
            }
            else{
              console.log("Does Not Exists Inserting .............")
              db.query(insert_query,
                [id, type, co, mark],
                (err) => {
                  if (err) {
                    console.log(err);
                    errors.push(err);
                  }
                }
              );
            }
          }
        })
        
      
      });
    });
  
    if (errors.length > 0) {
      return res.status(500).send("Error in Updating Marks");
    }
  
    return res.status(200).send("Mark Entered");
  };

  exports.getMarks = (req,res)=>{
    const query = `SELECT student,type,co_id,mark,present FROM mark_entry WHERE co_id = ? AND type = ?`
    db.query(query,[req.query.co_id,req.query.type],(err,rows)=>{
          if(err){
            console.log(err)
          }
          else{
            let mark_dict = {}
            rows.forEach(element => {
              mark_dict['S'+element.student+'C'+element.co_id+'T'+element.type] = {mark:element.mark,present:element.present}
            });

            res.send(mark_dict)

            console.log(mark_dict)
          }
    })
  }

  exports.updateAttendance = (req,res)=>{
    const query =  `INSERT IGNORE INTO mark_entry (student,type,co_id,present) VALUES (?,?,?,?)`
    const searchQuery = `SELECT s.id student,  c.id course , type.id type FROM master_students s   INNER JOIN master_courses  c INNER JOIN course_outcome co ON co.course = c.id INNER JOIN test_type type ON ?  = type.type
WHERE s.register_number = ? AND c.code = ?  LIMIT 1`
const coBound = 3
    req.body.data.map((data)=>{
      const present = data.Attendance == "Present" ? 1 :0
      db.query(searchQuery,[data["Test Type"],data["Register Number"],data["Course"]],(err,rows)=>{
        console.log(data)
        console.log(data["Register Number"],data["Course"])
        console.log()
        const student = rows[0].student
        const type = rows[0].type
        let limit = 5
        if(type<5){
            limit = 3
        }
        db.query(`SELECT co.id FROM course_outcome co INNER JOIN master_courses mc ON mc.id = co.course WHERE mc.id = ? ORDER BY co.id `+(type==2 || type==4?"DESC":"ASC") + ` LIMIT ?`,[rows[0].course,limit],(err,rows)=>{
           if(err){
            console.log(err)
           }
          rows.map((data)=>{
            db.query(query,[student,type,data.id,present],(err)=>{
              console.log(err)
            })
          })

          res.status(200)
        })
   
      })
    })
      

  }
  exports.markReport = (req,res)=>{
    const type = req.query.type
    const regulation = req.query.regulation
    const year = req.query.year
    const semester = req.query.semester
        const query = `SELECT report.branch,report.code,report.name,COUNT(report.student) strength,
COUNT(CASE WHEN report.present=1 THEN 1 ELSE NULL END) present_count,
COUNT(CASE WHEN report.present=0 THEN 1 ELSE NULL END) absent_count,
COUNT(CASE WHEN report.mark<25 THEN 1 ELSE NULL END) fail_count,
CONCAT(
FORMAT(
(COUNT(CASE WHEN report.mark>=25 THEN 1 ELSE NULL END)/COUNT(report.student) )*100,2
),"%") pass_percentage
FROM (SELECT  me.present,mb.branch, me.student,SUM(me.mark) mark,mc.code,mc.name,me.type  FROM mark_entry me  
INNER JOIN course_outcome co ON co.id = me.co_id 
INNER JOIN master_courses mc ON mc.id = co.course
INNER JOIN master_branch mb ON mb.id = mc.branch
INNER JOIN master_degree md ON md.id = mb.degree
INNER JOIN master_students ms ON ms.id = me.student
INNER JOIN master_regulation mr ON mr.id = md.regulation
 WHERE me.type =  ? AND mr.id = ? AND ms.year = ? AND mc.semester = ?
GROUP BY me.student,mc.code,mc.name,me.type,mb.branch,me.present) report GROUP BY report.code,report.branch,report.name
`
db.query(query,[type,regulation,year,semester],(err,rows)=>{
  console.log(rows)
  res.send(rows)
})
  }
