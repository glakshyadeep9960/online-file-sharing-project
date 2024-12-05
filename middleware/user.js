const jwt = require("jsonwebtoken");
const VerifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(404).json({ message: "Token not provided!" });
  }
  const tokenWithoutBearer = token.split(" ")[1];
  console.log(tokenWithoutBearer);

  try {
    const verifyToken = await jwt.verify(
      tokenWithoutBearer,
      process.env.JWT_KEY
    );
    console.log(verifyToken, "data");

    if (!verifyToken) {
      return res.status(405).json({ message: "Invalid Token" });
    } else {
      req.user = verifyToken;
    }
    next();
  } catch (error) {
    console.log("Error In Middleware", error);
  }
};

module.exports = VerifyToken;
