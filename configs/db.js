const mongoose = require("mongoose");

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected To MongoDB");
  } catch (error) {
    console.log(error, "Error In Connection to MongoDB");
  }
};
module.exports = ConnectDb;
