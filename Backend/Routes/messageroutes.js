const express = require("express");
const protect = require("../Middleware/Authmiddleware");
const { SendMessage } = require("../Controllers/MessageController");
const { allmessages } = require("../Controllers/MessageController");
const msgroutes = express.Router();

msgroutes.get("/:chatId", protect, allmessages);
msgroutes.post("/", protect, SendMessage);

module.exports = msgroutes;
