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
  
      student.marks.forEach((mark, i) => {
        const co = req.body.co[i].id;
        const query = `
        REPLACE INTO mark_entry (student, type, co_id, mark)
VALUES (?, ?, ?, ?);
        `
        db.query(query,
          [id, type, co, mark],
          (err) => {
            if (err) {
              console.log(err);
              errors.push(err);
            }
          }
        );
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