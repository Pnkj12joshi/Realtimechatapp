import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import "../../App.css";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/Chatlogic";
import ProfileModel from "./ProfileModel";
import UpdateGroupChat from "./UpdateGroupChat";
import ScrolableChat from "./ScrolableChat";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animation/typing.json";
const ENDPOINT = "http://localhost:5000/";
var socket, selectchatcompare;

const SingleChat = ({ fetchchatAgain, setfetchchatAgain }) => {
  const { user, selectedchat, setselectedchat, notification, setnotification } =
    ChatState();
  const toast = useToast();
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [connection, setconnection] = useState(false);
  const [typing, settyping] = useState(false);
  const [Isyping, setIstyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const Fetchchat = async () => {
    if (!selectedchat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(`/message/${selectedchat._id}`, config);
      setmessages(data);
      // console.log(messages);
      setloading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      toast({
        title: "Error during Fetching  the message",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    // Send a "setup" event to the server with the user data
    socket = io(ENDPOINT);
    // Send a "setup" event to the server with the user data
    socket.emit("setup", user);
    // Listen for a "connection" event from the server
    socket.on("connected", () => {
      // When connected, update the connection state to true
      setconnection(true);
    });
    socket.on("typing", () => setIstyping(true));
    socket.on("stop typing", () => setIstyping(false));
  }, []); // This runs once when the component mounts

  const SendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setnewmessage("");
      const { data } = await axios.post(
        "/message",
        {
          content: newmessage,
          chatId: selectedchat._id,
        },
        config
      );

      socket.emit("newmessages", data);
      setmessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error during Sending the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const Typinghandler = (e) => {
    setnewmessage(e.target.value);

    if (!connection) return;
    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedchat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("Stoptyping", selectedchat._id);
        settyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    Fetchchat();
    selectchatcompare = selectedchat;
  }, [selectedchat]);
  //console.log(notification, ".............");
  useEffect(() => {
    socket.on("message recieved", (newmessages) => {
      //console.log(newmessages);
      if (
        !selectchatcompare ||
        selectchatcompare._id !== newmessages.chat._id
      ) {
        if (!notification.includes(newmessages)) {
          setnotification([newmessages, ...notification]);
          setfetchchatAgain(!fetchchatAgain);
        }
      } else {
        setmessages([...messages, newmessages]); // here we put newmessagesfromclient inside the messages array
      }
    });
  });

  return (
    <>
      {" "}
      {selectedchat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between", md: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedchat("")}
            />
            {!selectedchat.isGroupChat ? (
              <>
                {getSender(user, selectedchat.user)}
                <ProfileModel user={getSenderFull(user, selectedchat.user)} />
              </>
            ) : (
              <>
                {selectedchat.chatName.toUpperCase()}
                <UpdateGroupChat
                  fetchchatAgain={fetchchatAgain}
                  setfetchchatAgain={setfetchchatAgain}
                  fetchChat={Fetchchat}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrolableChat messages={messages} style={{ flexGrow: 1 }} />
              </div>
            )}
            <FormControl display={"flex"} width={"100%"} p={2}>
              {Isyping ? (
                <div>
                  {" "}
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                placeholder="enter the chat"
                pt={1}
                borderRadius={"large"}
                bg={"white"}
                onChange={Typinghandler}
                value={newmessage}
              />
              <Button
                bg="#38B2AC"
                pl={3}
                variant="solid"
                alignItems={"center"}
                ml={1}
                onClick={SendMessage}
              >
                {" "}
                <i class="fa-solid fa-paper-plane"></i>
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            {" "}
            Select user to Chat{" "}
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
