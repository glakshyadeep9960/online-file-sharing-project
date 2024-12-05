const express = require("express");
const { register, VerifyAccount } = require("../controllers/user");
const VerifyToken = require("../middleware/user");
const router = express.Router();
router.route("/register").post(register);
router.route("/verify-account").put(VerifyToken, VerifyAccount);
module.exports = router;
