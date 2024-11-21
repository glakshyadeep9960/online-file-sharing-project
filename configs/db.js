const { Sequelize } = require("sequelize");
const sq = new Sequelize(process.env.DB_URL);
const DBConnection = async () => {
  try {
    await sq.authenticate();
    console.log("Database Connected");
  } catch (error) {
    console.log("Error In Connection of Database", error);
  }
};
module.exports = { sq, DBConnection };
