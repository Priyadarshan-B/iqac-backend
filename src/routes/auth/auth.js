const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    req.user.token = generateToken(req.user, 600);
    console.log("JWT Token:", req.user.token); 
    res.redirect(process.env.CLIENT_URL + "/facultymap?token=" + req.user.token);
  }
);

const generateToken = (user, expiresIn) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn });
};

module.exports = router;







// const router = require("express").Router();
// const passport = require("passport");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// const generateToken = (user) => {
//     return jwt.sign({ user }, JWT_SECRET, { expiresIn: '30s' });
// };

// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     const token = generateToken(req.user);

//     if (token) {
//         res.cookie("token", token, { maxAge: 30000, httpOnly: true });
//         res.status(200).json({
//             error: false,
//             message: "Successfully Logged In",
//             token: token,
//             user: req.user,
//         });
//     } else {
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
//   } else {
//     res.status(403).json({ error: true, message: "Not Authorized" });
//   }
// });

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: "Log in failure",
//   });
// });

// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:5173/",
//     failureRedirect: "http://localhost:5173/login",
//   })
// );

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.clearCookie("token");
//   res.redirect("http://localhost:5173/login");
// });

// module.exports = router;
