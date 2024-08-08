const db = require('../config/database');

exports.createEvaluationMapping = (req, res) => {
  const { semester, batch, branch } = req.query;
  const listParams = [semester, batch,branch];

  const query = `INSERT INTO semesterEvaluationMapping(course, faculty) SELECT mc.id,
fcm.faculty FROM master_courses mc INNER JOIN faculty_course_mapping
fcm ON  fcm.course = mc.id  WHERE mc.semester = ? AND fcm.batch = ? AND mc.branch = ?;`
  db.query(query, listParams, (err, results) => {
    console.log(listParams);
    if (err) {
      res.status(500).send('Error retrieving academic years');
      console.error('Error retrieving academic years:', err);
      return;
    }
    console.log(results);
    res.status(200).send('Successfully created EvaluationMapping');
  });
}
exports.getEvaluationMapping = (req, res) => {
  const { semester, batch, branch } = req.query;
  const listParams = [semester, batch];
  branch ? listParams.push(branch) : null;

  const query = `SELECT mc.id,
fcm.faculty FROM master_courses mc INNER JOIN faculty_course_mapping
fcm ON  fcm.course = mc.id  WHERE mc.semester = ? AND mc.batch = ? ${branch ? `AND mc.branch = ?` : ``};`
  db.query(query, listParams, (err, results) => {
    console.log(listParams);
    if (err) {
      res.status(500).send('Error retrieving academic years');
      console.error('Error retrieving academic years:', err);
      return;
    }
    console.log(results);
    res.status(200).send(results);
  });
}

exports.getSemesterFacultyAllocation = (req, res) => {
  const { semester, branch } = req.query;
  const listParams = [branch, semester]; // Adjusted to match the query parameter order
  console.log(listParams)
  const query = `SELECT 
    report2.course AS CourseName,
    report2.courseId,
    COUNT(DISTINCT report2.faculty) AS facultyCount,
    MAX(report2.student_count) AS totalPapers,
    GROUP_CONCAT(
        DISTINCT CONCAT(
            report2.faculty, 
            '||', 
            CASE 
                WHEN report2.status = '1' THEN 'active'
                WHEN report2.status = '2' THEN 'Faculty Approval Pending'
                WHEN report2.status = '3' THEN 'COE Approval Pending'
                WHEN report2.status = '4' THEN 'Replaced'
                ELSE 'unknown' -- Optional: handle unexpected statuses
            END
        ) 
        SEPARATOR ', '
    ) AS faculty
FROM (
    SELECT 
        CONCAT(mf.id, '||', mf.name, '||', mf.register_number, '||', mb.branch) AS faculty,
        mc.name AS course,
        sem.status,
        mc.id AS courseId,
        COUNT(DISTINCT ms.id) AS student_count
    FROM 
        semesterEvaluationMapping sem
    INNER JOIN master_courses mc ON mc.id = sem.course
    INNER JOIN master_faculty mf ON sem.faculty = mf.id
    INNER JOIN master_branch mb ON mb.id = mf.department
    INNER JOIN master_students ms ON ms.department = mc.branch
    WHERE 
        sem.batch = 1 AND
        mc.paper = '1' AND 
        mc.branch = ? AND 
        mc.semester = ?
    GROUP BY 
        mf.name, mf.register_number, mb.branch, mc.name, sem.status, mc.id, mf.id
) report2
GROUP BY 
    report2.course,
    report2.courseId
ORDER BY report2.course;

`;

  function parseFacultyString(facultyString) {
    return facultyString.split(', ').map(faculty => {
      const [id,facultyName, facultyId, department,status] = faculty.split('||');
      return {id,facultyName, facultyId, department,status };
    });
  }

  function processData(data) {
    return data.map(course => {
      return {
        ...course,
        faculty: parseFacultyString(course.faculty)
      };
    });
  }

  db.query(query, listParams, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "Database query failed" });
    } else {
      const newData = processData(rows);
      console.log(newData);
      res.send(newData);
    }
  });
};

exports.getHodSemesters = (req, res) => {
  const { hodId } = req.query;
  
  const query = `
    SELECT DISTINCT mc.semester
    FROM master_courses mc
    INNER JOIN faculty_course_mapping fcm ON mc.id = fcm.course
    INNER JOIN master_faculty mf ON fcm.faculty = mf.id
    WHERE mf.id = ?
  `;

  db.query(query, [hodId], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching HOD semesters');
      console.error('Error fetching HOD semesters:', err);
      return;
    }
    res.status(200).send(results);
  });
}

exports.getFacultyCourseDetails = (req, res) => {
  const { courseId, facultyRegisterNumber } = req.query;
  const listParams = [courseId,facultyRegisterNumber];

  // Create the base query
  let query = `
   WITH RankedFaculty AS (
    SELECT 
        mf.id, 
        CONCAT(
            mf.name, 
            CASE 
                WHEN fcm.batch = 1 THEN ' - handling the course this semester' 
                ELSE CONCAT(' - handled this course in the batch ', mb.batch) 
            END
        ) AS faculty_name,
        mf.register_number,
        fcm.batch,
        ROW_NUMBER() OVER (PARTITION BY mf.id ORDER BY fcm.batch ASC) AS rn
    FROM 
        faculty_course_mapping fcm
    INNER JOIN 
        master_faculty mf 
    ON 
        fcm.faculty = mf.id
    INNER JOIN
        master_batch mb
    ON 
        fcm.batch = mb.id
    WHERE 
        fcm.course = ? 
        AND mf.register_number != ?
)

SELECT DISTINCT
    id, 
    faculty_name, 
    register_number
FROM 
    RankedFaculty
WHERE 
    rn = 1;
  `;

  // If facultyRegisterNumber is provided, modify the query

 console.log(listParams)
  // Execute the query with the parameters
  db.query(query, listParams, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving faculty course details');
      console.error('Error retrieving faculty course details:', err);
      return;
    }
    console.log(results)
    res.status(200).send(results);
  });
};

exports.replaceFaculty = (req, res) => {
  const { courseId, oldFacultyId, newFacultyId, remarks } = req.body;

  // Insert into faculty_replacement_requests
  const insertQuery = `
    INSERT INTO faculty_replacement_requests (course_id, old_faculty_id, new_faculty_id, remarks, created_at)
    VALUES (?, ?, ?, ?, NOW());
  `;

  db.query(insertQuery, [courseId, oldFacultyId, newFacultyId, remarks], (insertErr, insertResult) => {
    if (insertErr) {
      console.error('Error inserting replacement request:', insertErr);
      return res.status(500).send('Error inserting replacement request');
    }

    // Update the status of the previous faculty in semesterEvaluationMapping
    const updateQuery = `
      UPDATE semesterEvaluationMapping 
      SET status = '2'  -- Assuming '0' indicates a deactivated status
      WHERE faculty = ? AND course = ? AND status = '1';
    `;

    db.query(updateQuery, [oldFacultyId, courseId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating faculty status:', updateErr);
        return res.status(500).send('Error updating faculty status');
      }

      res.status(200).send('Faculty replacement processed successfully');
    });
  });
};

exports.getReplacementRequestDetails = (req, res) => {
  const { facultyIds } = req.query; // Expecting an array of faculty IDs

  if (!facultyIds || !Array.isArray(facultyIds)) {
    return res.status(400).send('Invalid faculty IDs provided');
  }

  // Join the facultyIds array into a comma-separated string for the SQL IN clause
  const query = `
SELECT 
    frr.*, 
    mc.name course_name, 
    mf_old.name AS old_faculty_name, 
    mf_new.name AS new_faculty_name
FROM 
    faculty_replacement_requests frr
INNER JOIN 
    master_courses mc ON frr.course_id = mc.id
INNER JOIN 
    master_faculty mf_old ON frr.old_faculty_id = mf_old.id
INNER JOIN 
    master_faculty mf_new ON frr.new_faculty_id = mf_new.id
WHERE 
    frr.old_faculty_id IN (?);

  `;

  db.query(query, [facultyIds], (err, results) => {
    if (err) {
      console.error('Error fetching replacement request details:', err);
      return res.status(500).send('Error fetching replacement request details');
    }
    res.status(200).send(results);
  });
};

