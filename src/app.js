// src/app.js
const express = require('express');
const cors = require('cors');
const academicYearRoutes = require('./routes/academicyear_route');
const semesterRoutes = require('./routes/semester_route');
const degreeRoutes = require('./routes/degree_route');
const regualtionRoutes = require('./routes/regulation_route')
const departmentRoutes = require('./routes/deparment_routes')
const testTypeRoutes = require('./routes/testtype_route');
const courseRoutes =  require('./routes/course_route');
const facultyRoutes = require('./routes/faculty_route');
const courseOutcomeRoutes= require('./routes/courseoutcome_route')
const studentsRoutes = require('./routes/students_routes')
const yearRoutes = require('./routes/year_route')
const markEntryRoutes =  require('./routes/markentry_route')
const auth = require('./routes/auth/auth')
const app = express();
const port = 5000;
 
app.use(express.json())
// Enable CORS
app.use(cors());

const regulation_frame_routes = require('./routes/regulation_frame/regulation_frame')
const course_faculty_mapping_routes = require('./routes/course_faculty_mapping/course_faculty_mapping')

// Use academic year routes
app.use( academicYearRoutes);
app.use(semesterRoutes);
app.use(degreeRoutes);
app.use(regualtionRoutes);
app.use(departmentRoutes);
app.use(testTypeRoutes);
app.use(courseRoutes);
app.use(facultyRoutes);
app.use(courseOutcomeRoutes);
app.use(studentsRoutes)
app.use(yearRoutes)
app.use(markEntryRoutes)
app.use('/api/rf',regulation_frame_routes)
app.use('/api/cfm',course_faculty_mapping_routes)
app.use('/auth',auth)

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
