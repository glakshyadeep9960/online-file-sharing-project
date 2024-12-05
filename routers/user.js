const express = require("express");
const {
  register,
  VerifyAccount,
  login,
  getUser,
  updateUser,
  changePassword,
} = require("../controllers/user");
const VerifyToken = require("../middleware/user");
const router = express.Router();
router.route("/register").post(register);
router.route("/verify-account").put(VerifyToken, VerifyAccount);
router.route("/login").post(login);
router.route("/get-user").get(VerifyToken, getUser);
router.route("/update-user").put(VerifyToken, updateUser);
router.route("/change-password").put(VerifyToken, changePassword);
module.exports = router;
