const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const Message = require("../Models/MessageModel");

const SendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid chat id and content");
    return res.sendstatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      Latestmessage: message, //here we are updating latestMessage with message.
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const allmessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    // Check if the chat exists
    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { SendMessage, allmessages };
