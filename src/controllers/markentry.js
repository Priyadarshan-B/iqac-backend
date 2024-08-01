const { response } = require("express");
const db = require("../config/database");


exports.updateMarks = (req, res) => {
  console.log(req.body);

  if (req.body.length === 0) {
    return res.status(500).send("Error in Adding Marks");
  }

  let errors = [];
  console.log("test type is : " + req.body.testtype);
  req.body.student.forEach((student) => {
    const type = req.body.testtype;
    const id = student.id;
    const update_query = `
        UPDATE mark_entry SET mark = ? WHERE student = ? AND type = ? AND co_id = ? AND NOT mark = ?
        `
    const insert_query = `INSERT INTO mark_entry (student,type,co_id,mark) VALUES (?,?,?,?)`

    student.marks.forEach((mark, i) => {
      const co = req.body.co[i].id;

      db.query(`SELECT COUNT(id) count FROM mark_entry WHERE student = ? AND type = ? AND co_id = ? LIMIT 1`, [id, type, co], (err, rows) => {
        if (err) {
          console.log(err)
        }
        else {
          if (rows[0].count > 0) {
            console.log(rows, " exists updating ..............")
            db.query(update_query,
              [mark, id, type, co, mark],
              (err) => {
                if (err) {
                  console.log(err);
                  errors.push(err);
                }
              }
            );
          }
          else {
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

exports.getMarks = (req, res) => {
  const query = `SELECT student,type,co_id,mark,present FROM mark_entry WHERE co_id = ? AND type = ?`
  db.query(query, [req.query.co_id, req.query.type], (err, rows) => {
    if (err) {
      console.log(err)
    }
    else {
      let mark_dict = {}
      rows.forEach(element => {
        mark_dict['S' + element.student + 'C' + element.co_id + 'T' + element.type] = { mark: element.mark, present: element.present }
      });

      res.send(mark_dict)

      console.log(mark_dict)
    }
  })
}

exports.updateAttendance = (req, res) => {
  const query = `REPLACE INTO mark_entry (student,type,co_id,present) VALUES (?,?,?,?)`
  const searchQuery = `SELECT s.id student,  c.id course , type.id type FROM master_students s   INNER JOIN master_courses  c INNER JOIN course_outcome co ON co.course = c.id INNER JOIN test_type type ON ?  = type.type
WHERE s.register_number = ? AND c.code = ?  LIMIT 1`
  const coBound = 3
  req.body.data.map((data) => {
    const present = data.Attendance == "Present" ? 1 : 0
    db.query(searchQuery, [data["Test Type"], data["Register Number"], data["Course"]], (err, rows) => {
      console.log(data)
      console.log(data["Register Number"], data["Course"])
      console.log(rows)
      const student = rows[0]?.student
      const type = rows[0]?.type
      let limit = 5
      if (type < 5) {
        limit = 3
      }
      db.query(`SELECT co.id FROM course_outcome co INNER JOIN master_courses mc ON mc.id = co.course WHERE mc.id = ? ORDER BY co.id `
        + (type == 2 || type == 4 ? "DESC" : "ASC") + ` LIMIT ?`, [rows[0]?.course, limit], (err, rows) => {
          if (err) {
            console.log(err)
          }
          rows.map((data) => {
            db.query(query, [student, type, data.id, present], (err) => {
              console.log(err)
            })
          })

          res.status(200).send()
        })

    })
  })


}

exports.getStudentReport = (req, res) => {
  const { type, regulation, year, semester, course, department } = req.query;

  console.log(`semester: ${semester}`);
  console.log(`department: ${department}`);

  let query = `
    SELECT final_report.name AS Name, 
           final_report.register_number AS "Register Number",  
           'I' AS Semester, 
           final_report.Exam, 
           SUM(final_report.failures) AS "Number of Failures"
    FROM (
        SELECT report.name, 
               report.register_number, 
               report.courseCode AS Course, 
               SUM(report.mark) AS Mark, 
               report.typeName AS Exam, 
               CASE WHEN SUM(report.mark) < 25 THEN 1 ELSE 0 END AS failures
        FROM (
            SELECT me.mark, 
                   tt.type AS typeName, 
                   tt.id AS type, 
                   ms.name, 
                   ms.register_number, 
                   mc.code AS courseCode, 
                   co.course 
            FROM mark_entry me 
            INNER JOIN course_outcome co ON me.co_id = co.id 
            INNER JOIN master_students ms ON ms.id = me.student 
            INNER JOIN test_type tt ON tt.id = me.type 
            INNER JOIN master_courses mc ON mc.id = co.course 
            INNER JOIN master_branch mb ON mb.id = mc.branch 
            WHERE ms.year = ? 
${department !== undefined ? "AND ms.department = ?" : ""}
            GROUP BY ms.id, co.id, me.type, me.mark
        ) report 
        WHERE report.type = ?
        GROUP BY report.name, 
                 report.register_number, 
                 report.courseCode, 
                 report.typeName
        HAVING SUM(report.mark) < 25
    ) final_report 
    GROUP BY final_report.register_number
  `;

  console.log(query);

  const queryParams = [year];
  if (department !== undefined) queryParams.push(department);
  queryParams.push(type);

  console.log(queryParams);
  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    res.send(rows);
  });
};
exports.getMarkList = (req, res) => {
  const { type, regulation, year, semester, course, department } = req.query;

  console.log(`semester: ${semester}`);
  console.log(`department: ${department}`);

  let query = `
        SELECT report.name AS Name, report.register_number AS "Register Number", 
               report.courseCode AS Course, SUM(report.mark) AS Mark,
               '${semester}' AS Semester, report.typeName AS Exam 
        FROM (
            SELECT SUM(me.mark) AS mark, tt.type AS typeName, tt.id AS type, 
                   ms.name, ms.register_number, mc.code AS courseCode, co.course 
            FROM mark_entry me 
            INNER JOIN course_outcome co ON me.co_id = co.id 
            INNER JOIN master_students ms ON ms.id = me.student 
            INNER JOIN test_type tt ON tt.id = me.type 
            INNER JOIN master_courses mc ON mc.id = co.course 
            INNER JOIN master_branch mb ON mb.id = mc.branch 
            WHERE ms.year = ? 
${department != undefined ? "AND ms.department = ?" : ""}
            GROUP BY ms.id, co.id, me.type
        ) report 
        WHERE ${course != undefined ? "report.course = ? AND" : ""}
              report.type = ? 
        GROUP BY ${course == undefined ? "report.courseCode," : ""}
                 report.register_number
    `;

  console.log(query);

  const queryParams = [year];
  if (department != undefined) queryParams.push(department);
  if (course != undefined) queryParams.push(course);
  queryParams.push(type);
  console.log(queryParams)
  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    res.send(rows);
  });
}


exports.getAbsenteesAndFailures = (req, res) => {
  const type = req.query.type;
  const regulation = req.query.regulation;
  const year = req.query.year;
  const semester = req.query.semester;
  const course = req.query.course;
  const department = req.query.department; // Added department
  console.log(course, department);

  // First query for absentees and failures
  const query = `
    SELECT report.name AS Name,
           report.register_number AS "Register Number",
           report.courseCode AS Course,
           '${semester}' AS Semester,
           SUM(report.mark) AS Mark,
           report.Exam
    FROM (
      SELECT SUM(me.mark) AS mark,
             me.type,
             ms.name,
             ms.register_number,
             mc.code AS courseCode,
             co.course,
             tt.type AS Exam
      FROM mark_entry me
      INNER JOIN course_outcome co ON me.co_id = co.id
      INNER JOIN master_students ms ON ms.id = me.student
      INNER JOIN master_courses mc ON mc.id = co.course
      INNER JOIN test_type tt ON tt.id = me.type
      WHERE ms.year = ${year}  
    ${department != undefined ? `AND ms.department = ?` : ""}
      GROUP BY ms.id, co.id, me.type, mc.id
    ) report
    WHERE report.mark < 25
    ${course != undefined ? `AND report.course = ?` : ""}
    AND report.type = ?
    GROUP BY ${course == undefined ? `report.courseCode,` : ""}
    report.register_number
    HAVING SUM(report.mark) < 25;
  `;

  console.log(query);

  const params = [];
  if (course != undefined) {
    params.push(course);
    console.log("course")
  }
  if (department != undefined) {
    params.push(department);
    console.log("department")
  }
  params.push(type);
  console.log(params)
  db.query(query, params, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send(err);
    }

    let data = [];
    console.log(rows);
    data.push(...rows);

    // Second query for absentees
    const query2 = `
      SELECT DISTINCT ms.name,
ms.register_number,
                          mc.code AS Course,
'${semester}' AS Semester,

             'absent' AS Mark,
             tt.type AS Exam
      FROM mark_entry me
      INNER JOIN master_students ms ON ms.id = me.student
      INNER JOIN course_outcome co ON co.id = me.co_id
      INNER JOIN master_courses mc ON mc.id = co.course
      INNER JOIN test_type tt ON tt.id = me.type
      WHERE me.present = 0
      ${course != undefined ? `AND mc.id = ?` : ""}
      ${department != undefined ? `AND ms.department = ?` : ""}
      AND me.type = ?;
    `;

    console.log(query2);

    const params2 = [];
    if (course != undefined) {
      params2.push(course);
      console.log("course")

    }
    if (department != undefined) {
      params2.push(department);
      console.log("department")

    }
    params2.push(type);
    console.log(params2)
    db.query(query2, params2, (err, rows) => {
      if (err) {
        console.error('Error executing second query:', err);
        return res.status(500).send(err);
      }

      console.log(rows);
      data = [...data, ...rows];
      console.log(data);
      res.send(data);
    });
  });
}
exports.absenteesAndFailures = (req, res) => {
  const type = req.query.type
  const regulation = req.query.regulation
  const year = req.query.year
  const semester = req.query.semester
  const query = `SELECT report.branch Department
,report.code "Course Code",
report.name "Course Name",
report.course_id,
COUNT(report.student) "Total Students",
COUNT(CASE WHEN report.mark<25 THEN 1 ELSE NULL END) "Failure Count",
COUNT(CASE WHEN report.present=0 THEN 1 ELSE NULL END) "Absentees Count"
FROM (SELECT  me.present,mb.branch, me.student,SUM(me.mark) mark,mc.code,mc.name,mc.id course_id,me.type  FROM mark_entry me  
INNER JOIN course_outcome co ON co.id = me.co_id 
INNER JOIN master_courses mc ON mc.id = co.course
INNER JOIN master_branch mb ON mb.id = mc.branch
INNER JOIN master_degree md ON md.id = mb.degree
INNER JOIN master_students ms ON ms.id = me.student
INNER JOIN master_regulation mr ON mr.id = md.regulation
 WHERE me.type =  ? AND mr.id = ? AND ms.year = ? AND mc.semester = ?
GROUP BY me.student,mc.code,mc.name,me.type,mb.branch,me.present,mc.id)
report GROUP BY report.code,report.branch,report.name,report.course_id
`
  db.query(query, [type, regulation, year, semester], (err, rows) => {
    console.log(err);
    console.log(rows)
    res.send(rows)
  })
}




exports.getFailures = (req, res) => {
  const { type, year, semester, course, department } = req.query;
  console.log(`department: ${department} | course: ${course} | type: ${type}`);

  // Determine the conditions for the query
  const courseCondition = course ? "AND report.course = ?" : "";
  const departmentCondition = department ? "AND ms.department = ?" : "";
  const groupByCourse = !course ? "report.courseCode," : "";

  // Construct the query
  const query = `
    SELECT report.name AS Name,
           report.register_number AS "Register Number",
           report.courseCode AS Course,
               '${semester}' AS Semester,
           SUM(report.mark) AS Mark,
           report.Exam
    FROM (
      SELECT SUM(me.mark) AS mark,
             me.type,
             ms.name,
             ms.register_number,
             mc.code AS courseCode,
             co.course,
             tt.type AS Exam
      FROM mark_entry me
      INNER JOIN course_outcome co ON me.co_id = co.id
      INNER JOIN master_students ms ON ms.id = me.student
      INNER JOIN master_courses mc ON mc.id = co.course
      INNER JOIN test_type tt ON tt.id = me.type
      WHERE ms.year = ?
      ${departmentCondition}
      GROUP BY ms.id, co.id, me.type, mc.id
    ) report
    WHERE report.mark < 25
    ${courseCondition}
    AND report.type = ?
    GROUP BY ${groupByCourse} report.register_number
    HAVING SUM(report.mark) < 25;
  `;

  console.log(query);

  // Construct the query parameters array
  const queryParams = [year];
  if (department) {
    queryParams.push(department);
    console.log("department is here")
  } if (course) {
    queryParams.push(course);
    console.log("course is here")

  }
  queryParams.push(type);

  console.log(queryParams);

  // Execute the query
  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    res.send(rows);
  });
};



exports.getAbsentees = (req, res) => {
  const type = req.query.type;
  const regulation = req.query.regulation;
  const year = req.query.year;
  const semester = req.query.semester;
  const course = req.query.course;
  const department = req.query.department;

  const query = `
    SELECT DISTINCT ms.register_number,
           ms.name,
           mc.code AS Course,
'${semester}' AS Semester,

           tt.type AS Exam
    FROM mark_entry me
    INNER JOIN master_students ms ON ms.id = me.student
    INNER JOIN course_outcome co ON co.id = me.co_id
    INNER JOIN master_courses mc ON mc.id = co.course
    INNER JOIN test_type tt ON tt.id = me.type
    WHERE me.present = 0
    ${course != undefined ? `AND mc.id = ?` : ""}
    ${department != undefined ? `AND ms.department = ?` : ""}
    AND me.type = ?;
  `;

  const params = [];
  if (course != undefined) {
    params.push(course);
  }
  if (department != undefined) {
    params.push(department);
  }
  params.push(type);

  console.log(query);
  console.log(params); // Log parameters to check their values

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send(err);
      return;
    }
    console.log(rows);
    res.send(rows);
  });
}


exports.markReport = (req, res) => {
  const type = req.query.type
  const regulation = req.query.regulation
  const year = req.query.year
  const semester = req.query.semester
  const query = `SELECT report.branch Department
,report.code "Course Code",
report.name "Course Name",
report.course_id,
COUNT(report.student) "Total Students",
COUNT(CASE WHEN report.present=1 THEN 1 ELSE NULL END) "Present Count",
COUNT(CASE WHEN report.present=0 THEN 1 ELSE NULL END) "Absentees Count",
COUNT(CASE WHEN report.mark<25 THEN 1 ELSE NULL END) "Failure Count",
CONCAT(
FORMAT(
(COUNT(CASE WHEN report.mark>=${type == 5 ? 50 : 25} THEN 1 ELSE NULL END)/COUNT(report.student) )*100,2
),"%") "Pass Percentage",
COUNT(CASE WHEN report.mark<21 THEN 1 ELSE NULL END) "[0-20]",
COUNT(CASE WHEN report.mark>=21 AND report.mark<=50 THEN 1 ELSE NULL END) "[21-50]",
${type == 5 ? `
COUNT(CASE WHEN report.mark>=51 AND report.mark<=80 THEN 1 ELSE NULL END) "[51-80]",
COUNT(CASE WHEN report.mark>=81 AND report.mark<=100 THEN 1 ELSE NULL END) "[81-100]",
`: ''
    }
MIN(CASE WHEN report.present=1 THEN report.mark END) "Minimum Mark",
MAX(CASE WHEN report.present=1 THEN report.mark END) "Maximum Mark"
FROM (SELECT  me.present,mb.branch, me.student,SUM(me.mark) mark,mc.code,mc.name,mc.id course_id,me.type  FROM mark_entry me  
INNER JOIN course_outcome co ON co.id = me.co_id 
INNER JOIN master_courses mc ON mc.id = co.course
INNER JOIN master_branch mb ON mb.id = mc.branch
INNER JOIN master_degree md ON md.id = mb.degree
INNER JOIN master_students ms ON ms.id = me.student
INNER JOIN master_regulation mr ON mr.id = md.regulation
 WHERE me.type =  ? AND mr.id = ? AND ms.year = ? AND mc.semester = ?
GROUP BY me.student,mc.code,mc.name,me.type,mb.branch,me.present,mc.id)
report GROUP BY report.code,report.branch,report.name,report.course_id
`
  db.query(query, [type, regulation, year, semester], (err, rows) => {
    console.log(err);
    console.log(rows)
    res.send(rows)
  })
}


exports.absenteesReport = (req, res) => {
  const type = req.query.type
  const regulation = req.query.regulation
  const year = req.query.year
  const semester = req.query.semester
  const query = `SELECT report.branch Department
,report.code "Course Code",
report.name "Course Name",
report.course_id,
COUNT(report.student) "Total Students",
COUNT(CASE WHEN report.present=0 THEN 1 ELSE NULL END) "Absentees Count"
FROM(SELECT  me.present, mb.branch, me.student, SUM(me.mark) mark, mc.code, mc.name, mc.id course_id, me.type  FROM mark_entry me  
INNER JOIN course_outcome co ON co.id = me.co_id 
INNER JOIN master_courses mc ON mc.id = co.course
INNER JOIN master_branch mb ON mb.id = mc.branch
INNER JOIN master_degree md ON md.id = mb.degree
INNER JOIN master_students ms ON ms.id = me.student
INNER JOIN master_regulation mr ON mr.id = md.regulation
 WHERE me.type =  ? AND mr.id = ? AND ms.year = ? AND mc.semester = ?
  GROUP BY me.student, mc.code, mc.name, me.type, mb.branch, me.present, mc.id)
report GROUP BY report.code, report.branch, report.name, report.course_id
  `
  db.query(query, [type, regulation, year, semester], (err, rows) => {
    console.log(err);
    console.log(rows)
    res.send(rows)
  })
}

exports.failureReport = (req, res) => {
  const type = req.query.type
  const regulation = req.query.regulation
  const year = req.query.year
  const semester = req.query.semester
  const query = `SELECT report.branch Department
,report.code "Course Code",
report.name "Course Name",
report.course_id,
COUNT(report.student) "Total Students",
COUNT(CASE WHEN report.mark<25 THEN 1 ELSE NULL END) "Failure Count"
FROM (SELECT  me.present,mb.branch, me.student,SUM(me.mark) mark,mc.code,mc.name,mc.id course_id,me.type  FROM mark_entry me  
INNER JOIN course_outcome co ON co.id = me.co_id 
INNER JOIN master_courses mc ON mc.id = co.course
INNER JOIN master_branch mb ON mb.id = mc.branch
INNER JOIN master_degree md ON md.id = mb.degree
INNER JOIN master_students ms ON ms.id = me.student
INNER JOIN master_regulation mr ON mr.id = md.regulation
 WHERE me.type =  ? AND mr.id = ? AND ms.year = ? AND mc.semester = ?
GROUP BY me.student,mc.code,mc.name,me.type,mb.branch,me.present,mc.id)
report GROUP BY report.code,report.branch,report.name,report.course_id
`
  db.query(query, [type, regulation, year, semester], (err, rows) => {
    console.log(err);
    console.log(rows)
    res.send(rows)
  })
}


