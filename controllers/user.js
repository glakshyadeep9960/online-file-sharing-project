const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const CreateToken = async (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "2h",
    }
  );
};
exports.register = async (req, res) => {
  const { userName, email, phone, password } = req.body;
  try {
    const findUser = await User.findOne({
      where: { email: email },
    });
    if (findUser) {
      return res.status(400).json({ message: "User already Exists!" });
    } else {
      const genSalt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, genSalt);
      const newUser = await User.create({
        userName,
        email,
        phone,
        password: hashedPassword,
      });
      const token = await CreateToken(newUser);
      const message = `${token}`;
      await sendMail(email, "User Registeration", message);
      return res.status(200).json({
        message: "Please Verify Your Account, We have sent the message!",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Occured at Registering User", error });
  }
};
