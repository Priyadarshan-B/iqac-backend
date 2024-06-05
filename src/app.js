<<<<<<< HEAD
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
const app = express();
const port = 5000;
 
app.use(express.json())
// Enable CORS
app.use(cors());

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
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
=======
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/auth/auth");
const passportStrategy = require("./config/passport_config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

dotenv.config();

// Assuming JWT_SECRET is stored in .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for generating JWT token
const generateToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, { expiresIn: '30s' });
};
// routes
const regulation_frame_routes = require("./routes/regulation_frame/regulation_frame");
const course_faculty_mapping_routes = require("./routes/course_faculty_mapping/course_faculty_mapping");

const app = express();
const port = 5000;

app.use(
 session({
    secret: "my_screct_key_is_iqac",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30000, 
        name: "cookie_die",
    },
 })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
 cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
 })
);

app.use(morgan(
 ":method :url :status :res[content-length] - :response-time ms"
));
app.use(bodyParser.json());
app.use(express.json());

app.post("/auth/login", (req, res) => {
 // Placeholder for actual authentication logic
 const user = {
    id: 1,
    username: req.body.username,
    email: req.body.email
 };

 const token = generateToken(user);
 res.json({ token });
>>>>>>> e170c66d1a1b494a1ab2393cc1b905b3c8393beb
});

app.use("/api/rf", regulation_frame_routes);
app.use("/api/cfm", course_faculty_mapping_routes);
app.use("/auth", authRoutes);

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});


// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const session = require("express-session");
// const passport = require("passport");
// const authRoutes = require("./routes/auth/auth");
// const passportStrategy = require("./config/passport_config");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// dotenv.config();

// // Generate a random string of 32 characters for JWT secret
// const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// // Middleware for generating JWT token
// const generateToken = (user) => {
//     return jwt.sign({ user }, JWT_SECRET, { expiresIn: '30s' });
// };

// //routes
// const regulation_frame_routes = require("./routes/regulation_frame/regulation_frame");
// const course_faculty_mapping_routes = require("./routes/course_faculty_mapping/course_faculty_mapping");

// //middleware logger config
// const morgan_config = morgan(
//   ":method :url :status :res[content-length] - :response-time ms"
// );

// const app = express();
// const port = 5000;

// // Enable CORS AND LOGGER MIDDLEWARE
// app.use(
//   session({
//     secret: "my_screct_key_is_iqac",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 30000,
//         name: "cookie_die",
//     },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// app.use(morgan_config);
// app.use(bodyParser.json());
// app.use(express.json());

// // Example authentication route
// app.post("/auth/login", (req, res) => {
//   // Assuming you have some authentication logic here...
//   const user = {
//     id: 1,
//     username: req.body.username,
//     email: req.body.email
//     // Other user properties...
//   };

//   // Generate a token for the authenticated user
//   const token = generateToken(user);

//   // Send the token back to the client
//   res.json({ token });
// });

// app.use("/api/rf", regulation_frame_routes);
// app.use("/api/cfm", course_faculty_mapping_routes);
// app.use("/auth", authRoutes);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // app.get("/logout", (req, res) => {
// //   req.session.destroy((err) => {
// //     if (err) {
// //       console.error("Error destroying session:", err);
// //       return res.status(500).send("Error destroying session");
// //     }
// //   });
// //   res.clearCookie('cookie_die');
// //   res.redirect("/login");
// // });
