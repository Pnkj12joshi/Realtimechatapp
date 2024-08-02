const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const { verifytoken } = require("../Config/GenerateToken");

//middleware that resist the new user
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //try to verify the token
      const decoded = jwt.verify(token, process.env.JWT_Skey);
      req.user = await User.findById(decoded.id).select("-password"); // it will select without password
      next();
    } catch (error) {
      res.status(401).json({ message: "Not Authorized,token failed" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized, no token" });
  }
};

module.exports = protect;
