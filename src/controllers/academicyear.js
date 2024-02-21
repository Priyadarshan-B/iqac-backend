// src/controllers/academicYearController.js
const db = require('../config/database');

// Function to get academic years from the database
exports.getAcademicYears = (req, res) => {
  const query = 'SELECT id, year FROM academic_year';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving academic years');
      console.error('Error retrieving academic years:', err);
      return;
    }
    res.json(results);
  });
};