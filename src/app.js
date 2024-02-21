// src/app.js
const express = require('express');
const cors = require('cors');
const academicYearRoutes = require('./routes/academicyear_route');
const semesterRoutes = require('./routes/semester_route');
const degreeRoutes = require('./routes/degree_route');
const regualtionRoutes = require('./routes/regulation_route')
const departmentRoutes = require('./routes/deparment_routes')

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Use academic year routes
app.use( academicYearRoutes);
app.use(semesterRoutes);
app.use(degreeRoutes);
app.use(regualtionRoutes);
app.use(departmentRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
