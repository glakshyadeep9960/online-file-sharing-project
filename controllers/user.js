const User = require("../models/user");
const sendMail = require("./sendMail");

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(404).json({ message: "Data is not complete" });
  }
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(402).json({ message: "User already Exists!" });
    } else {
      const newUser = await User.create({
        name,
        email,
        password,
        phone,
        address,
      });
      const message = await newUser.generateToken();
      await sendMail(email, "Confirm Account Registeration", message);
      return res
        .status(200)
        .json({ message: "Confirm Your Account Via Email Provided!" });
    }
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Register Api of User Faced an Error", err: error });
  }
};

exports.VerifyAccount = async (req, res) => {
  const { id } = req.user;
  console.log(id);

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const isAlreadyVerified = findUser.isVerified;
      if (isAlreadyVerified) {
        return res.status(202).json({ message: "User already Verified" });
      } else {
        await User.updateOne({ _id: id }, { isVerified: true });
        return res.status(200).json({ message: "User Verified Successfully!" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error In verification of account!" });
  }
};
