const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  groupadd,
  removeGroup,
} = require("../Controllers/ChatController");
const protect = require("../Middleware/Authmiddleware");
const chatroutes = express.Router();

chatroutes.get("/", protect, fetchChat);
chatroutes.post("/", protect, accessChat);

chatroutes.post("/group", protect, createGroupChat);
chatroutes.put("/rename", protect, renameGroup);
chatroutes.put("/groupremove", protect, removeGroup);
chatroutes.put("/groupadd", protect, groupadd);

module.exports = chatroutes;
