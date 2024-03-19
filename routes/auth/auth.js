const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"],prompt: 'select_account'  })
);

router.get("/google/callback",
 passport.authenticate("google", { failureRedirect: "/login" }),
 function(req, res) {
    if (req.user.error && req.user.error.message === 'Email not found in master_students') {
      // Redirect to /login if email not found in master_students
      return res.redirect('/login');
    }
    req.user.token = generateToken(req.user, 300);
    console.log("JWT Token:", req.user.token); 
    res.redirect(process.env.CLIENT_URL + "/markentry?token=" + req.user.token);
 }
);

const generateToken = (user, expiresIn) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn });
};

module.exports = router;
