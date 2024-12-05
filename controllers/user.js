const User = require("../models/user");
const sendMail = require("./sendMail");
const bcrypt = require("bcrypt");
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "Data is not provided!" });
  }

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      const isUserVerified = await User.findOne({ isVerified: true });
      const token = await findUser.generateToken();

      if (!isUserVerified) {
        const message = token;
        await sendMail(email, "Account Verification", message);
        return res
          .status(404)
          .json({ message: "Please Verify Your Account First!" });
      } else {
        const matchPassword = await findUser.comparePass(password);
        if (!matchPassword) {
          return res.status(402).json({ message: "Incorrect Password!" });
        } else {
          return res.status(200).json({ message: "Logging In!", token: token });
        }
      }
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "An Error Occured at login" });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json({
      message: "User fetched Successfully",
      data: findUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An Error Occured at Fetching User" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  const { name, phone, address } = req.body;
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      const updateUser = await User.updateOne(
        { _id: id },
        {
          name,
          phone,
          address,
        }
      );
      const findUpdatedUser = await User.findById(id);
      return res
        .status(200)
        .json({ message: "User has been updated", data: findUpdatedUser });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An Error Occured at Updating User" });
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      const matchPassword = await findUser.comparePass(currentPassword);
      if (!matchPassword) {
        return res.status(400).json({ message: "Password Incorrect!" });
      } else {
        const genSalt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(newPassword, genSalt);
        await User.updateOne({ _id: id }, { password: hashPassword });
        return res.status(200).json({ message: "Password has been changed!" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Occured at Changing password" });
  }
};
