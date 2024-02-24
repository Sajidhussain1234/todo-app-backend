const express = require("express");
const process = require("process");
const connectToMOngo = require("./db");
var cors = require("cors");

const port = process.env.PORT;
connectToMOngo();
const app = express();
app.use(cors()); // cors() method is used to handle cors policy. -: 'http://localhost:3000' has been blocked by CORS policy:

// middleware (if we want to use api body content then we should must add this middleware)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Backend");
});

// //available routes
app.use("/api/auth", require("./routes/auth")); // route for authentication of user
app.use("/api/task", require("./routes/task")); // route for storing tasks

app.listen(port, () => {
  console.log(`Backend of todo app serve at http://localhost:${port}`);
});
