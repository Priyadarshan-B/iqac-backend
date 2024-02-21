const db = require('../config/database');

exports.getDegree = (req, res) => {
    const query = 'SELECT id, degree FROM master_degree';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving academic years');
        console.error('Error retrieving academic years:', err);
        return;
      }
      res.json(results);
    });
  };