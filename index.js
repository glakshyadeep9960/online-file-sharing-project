// importing dotenv that used for security purposes
require("dotenv").config({ path: "./configs/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const path = require("path");
const { DBConnection } = require("./configs/db");
const UserRouter = require("./routers/user");

// middleware for handling json
app.use(express.json());

// enable cross origin security
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// serving local file stored in uploads folder
app.use("uploads", express.static(path.join(__dirname, "uploads")));

// database connection execution
DBConnection();

// testing api
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "There you go. Backend Caught Running...",
  });
});

// handling apis

app.use("/api/v1/user", UserRouter);

// app listening
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
