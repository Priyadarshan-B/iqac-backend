const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
 host: process.env.DATABASE_HOST,
 user: process.env.DATABASE_USER,
 password: process.env.DATABASE_PASSWORD,
 database: process.env.DATABASE_NAME
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
 },
 function(accessToken, refreshToken, profile, cb) {
    // Check if user exists in the database
    const query = `SELECT * FROM google_users WHERE google_id = ?`;
    db.query(query, [profile.id], function(error, results) {
      if (error) {
        return cb(error);
      }
      if (results.length > 0) {
        // User exists, check email in master_students table
        const emailQuery = `SELECT * FROM master_students WHERE email = ?`;
        db.query(emailQuery, [profile.emails[0].value], function(error, masterResults) {
          if (error) {
            return cb(error);
          }
          if (masterResults.length > 0) {
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '5m' });
            return cb(null, { token });
          } else {
            return cb(new Error('Email not found in master_students'));
          }
        });
      } else {
        const insertQuery = `INSERT INTO google_users (google_id, name, email) VALUES (?, ?, ?)`;
        db.query(insertQuery, [profile.id, profile.displayName, profile.emails[0].value], function(error, results) {
          if (error) {
            return cb(error);
          }
          const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, { expiresIn: '5m' });
          return cb(null, { token });
        });
      }
    });
 }
));

passport.serializeUser(function(user, done) {
 done(null, user);
});

passport.deserializeUser(function(user, done) {
 done(null, user);
});

module.exports = passport;
