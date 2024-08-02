const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const mongoose = require("mongoose");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User Params not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { user: { $elemMatch: { $eq: req.user._id } } }, // here $elemMatch is match req.user.id in user array.
      { user: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("user", "-password")
    .populate("Latestmessage");

  isChat = await User.populate(isChat, {
    path: "Latestmessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatdata = {
      //here we creating one collections with the name chatdata for ChatModel
      chatName: "sender",
      isGroupChat: false,
      user: [req.user._id, userId],
    };

    try {
      const chatcreated = await Chat.create(chatdata);
      const FullChat = await Chat.findOne({ _id: chatcreated._id }).populate(
        "user",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChat = async (req, res) => {
  try {
    Chat.find({ user: { $elemMatch: { $eq: req.user._id } } })
      .populate("user", "-password")
      .populate("groupAdmin", "-password")
      .populate("Latestmessage")
      .sort({ updateAt: -1 }) //here it is sort from recent to oldest .
      .then(async (result) => {
        result = await User.populate(result, {
          path: "Latestmessage.sender",
          select: "name email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send("More than 2 users are required ");
  }
  users.push(req.user); // here it push (logged user ) in users
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      user: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("user", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true, // here new true is used to display latest chat name
    }
  )
    .populate("user", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
};
const groupadd = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { user: userId },
    },
    {
      new: true,
    }
  )
    .populate("user", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(400);
    throw new Error("Chat not Found");
  } else {
    res.json(added);
  }
};
const removeGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { user: userId },
    },
    {
      new: true,
    }
  )
    .populate("user", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(400);
    throw new Error("Chat not Found");
  } else {
    res.json(remove);
  }
};
module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  groupadd,
  removeGroup,
};
