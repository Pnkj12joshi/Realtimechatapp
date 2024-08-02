const express = require("express");
const app = express();
const dot = require("dotenv");
const connectDB = require("./Config/Db");
const router = require("./Routes/route");
const chatroutes = require("./Routes/chatroutes");
const msgroutes = require("./Routes/messageroutes");
const cors = require("cors");

dot.config();
app.use(express.json());
connectDB();
app.use("/", router);
app.use("/chats", chatroutes);
app.use("/message", msgroutes);
app.use(cors());

const PORT = process.env.Port || 5000;

const server = app.listen(PORT, console.log("server is started", PORT));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  // Listen for "setup" events from the client
  socket.on("setup", (userdata) => {
    // Make the socket join a room identified by the user's ID
    socket.join(userdata._id); //here join is used for creating the room
    console.log(userdata._id);
    // Send a "connected" event back to the client
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("Stoptyping", (room) => socket.in(room).emit("Stoptyping"));

  socket.on("newmessages", (newmessagefromclient) => {
    //console.log(newmessagefromclient.content);
    var chat = newmessagefromclient.chat;
    //console.log(chat.user);
    if (!chat.user) return console.log("chat users not defined");
    chat.user.forEach((user) => {
      if (user._id == newmessagefromclient.sender._id) return;
      socket.in(user._id).emit("message recieved", newmessagefromclient);
    });
  });
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
