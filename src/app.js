// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//routes
const regulation_frame_routes = require("./routes/regulation_frame/regulation_frame");
const course_faculty_mapping_routes = require("./routes/course_faculty_mapping/course_faculty_mapping");

//middleware logger config
const morgan_config = morgan(
    ":method :url :status :res[content-length] - :response-time ms"
);

const app = express();
const port = 5000;

// Enable CORS AND LOGGER MIDDLEWARE
app.use(cors());
app.use(morgan_config);

app.use("/api/rf", regulation_frame_routes);
app.use("/api/cfm", course_faculty_mapping_routes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
