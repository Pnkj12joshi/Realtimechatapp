const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    user: [
      //this is array of object :)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Latestmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
