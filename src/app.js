// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dropdown_routes = require("./routes/dropdown/regulation_frame");
const morgan_config = morgan(":method :url :status :res[content-length] - :response-time ms")

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());


// Use academic year routes
app.use(morgan_config);
app.use("/api", dropdown_routes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
