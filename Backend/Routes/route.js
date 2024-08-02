const express = require("express");
const router = express.Router();
const {
  registerUser,
  AuthUser,
  allUsers,
} = require("../Controllers/UserController");
const protect = require("../Middleware/Authmiddleware");
router.get("/", (req, res) => {
  res.send("hello from Server side");
});
router.post("/Signup", registerUser);
router.post("/Login", AuthUser);
router.get("/Chatuser", protect, allUsers);
module.exports = router;
