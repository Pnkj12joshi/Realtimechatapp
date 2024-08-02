const User = require("../Models/UserModel");
const { generatetoken } = require("../Config/GenerateToken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send("Info is not define");
  }
  const UserExist = await User.findOne({ email });
  if (UserExist) {
    res.status(400);
    throw new Error("User already Exist");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generatetoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to register");
  }
};
const AuthUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchpassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generatetoken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Username and Password");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // it means that it find the keywords and ids except the req.user_id.
  res.send(user);
};

module.exports = { registerUser, AuthUser, allUsers };
