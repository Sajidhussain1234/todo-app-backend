const express = require("express");
const connectToMOngo = require("./db");
var cors = require("cors");

connectToMOngo();
const app = express();
const port = process.env.PORT;
app.use(cors()); // cors() method is used to handle cors policy. -: 'http://localhost:3000' has been blocked by CORS policy:

// middleware (if we want to use api body content then we should must add this middleware)
app.use(express.json());

// default route on port = 5000
app.get("/", (req, res) => {
  res.send("Hello Sajid");
});

// //available routes
// app.use("/api/auth", require("./routes/auth")); // route for authentciation of user
// app.use("/api/note", require("./routes/note")); // route for storing notes

app.listen(port, () => {
  console.log(`Backend of noteOnCloud serve at http://localhost:${port}`);
});
