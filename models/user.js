const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
  },
});

UserSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "10h",
    }
  );
};

UserSchema.pre("save", async function () {
  try {
    const genSalt = await bcrypt.genSalt(12);
    const hashPass = await bcrypt.hash(this.password, genSalt);
    this.password = hashPass;
  } catch (error) {
    console.log("Error in Hashing the password");
  }
});

UserSchema.methods.comparePass = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
