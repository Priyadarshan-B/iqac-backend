const db = require('../config/database');

exports.getSemester = (req, res) => {
    const query = 'SELECT id, semester FROM master_semester';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving academic years');
        console.error('Error retrieving academic years:', err);
        return;
      }
      res.json(results);
    });
  };