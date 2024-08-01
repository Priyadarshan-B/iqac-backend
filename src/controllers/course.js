const db = require("../config/database");

exports.getCourse = (req, res) => {
  let query;
  if (req.query.semester && req.query.faculty && req.query.branch) {
    const semester = Number(req.query.semester)
    const faculty = req.query.faculty;
    const branch = req.query.branch;
    console.log(semester);
    query = `SELECT master_courses.id, master_courses.name , master_courses.code FROM master_courses  INNER JOIN faculty_course_mapping fcm ON fcm.course = master_courses.id WHERE master_courses.status = '1' AND master_courses.semester=${semester} AND fcm.faculty=${faculty} AND master_courses.branch = ${branch}`
  }

  else {
    query = `SELECT id,name FROM master_courses WHERE status = '1'`

  }

  db.query(query, (err, rows) => {
    if (err) {
      res.status(500).send('Error in retrieving courses')
    }
    else {
      res.json(rows);
    }
  })
}
exports.getCourseId = (req, res) => {
  const course = req.query.course;
  const query = `SELECT id course_id FROM master_courses WHERE name = ?`;
  db.query(query, (err, rows) => {
    if (err) {
      console.log(err)
    }
    else {
      res.send(rows);
    }
  })
}
