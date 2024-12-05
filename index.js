require("dotenv").config({ path: "./configs/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const path = require("path");
const ConnectDb = require("./configs/db");
const router = require("./routers/user");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "There you go. Backend Caught Running...",
  });
});
ConnectDb();

app.use("/api/v1/user", router);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
