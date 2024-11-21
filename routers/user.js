const express = require("express");
const { register } = require("../controllers/user");
const UserRouter = express.Router();
UserRouter.route("/register").post(register);
module.exports = UserRouter;
