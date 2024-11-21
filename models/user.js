const { sq } = require("../configs/db");
const Datatypes = require("sequelize");
const User = sq.define("user", {
  userId: {
    type: Datatypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  userName: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  email: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  phone: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: Datatypes.BOOLEAN,
    defaultValue: false,
  },
  stripeId: {
    type: Datatypes.STRING,
  },
  paid: {
    type: Datatypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: Datatypes.STRING,
    allowNull: false,
  },
});
User.sync().then(() => {
  console.log("User Model has been synced");
});
module.exports = User;
