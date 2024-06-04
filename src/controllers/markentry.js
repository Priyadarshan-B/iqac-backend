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
  
        db.query(
          `INSERT INTO mark_entry(student,type,co_id,mark) VALUES (?,?,?,?)`,
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