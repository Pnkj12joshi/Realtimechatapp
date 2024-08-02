import React from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchchatAgain, setfetchchatAgain }) => {
  const { user, setuser, selectedchat, setselectedchat, chat, setchat } =
    ChatState();
  return (
    <Box
      display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      w={{ base: "100%", md: "68%" }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      height="100%"
    >
      <SingleChat
        fetchchatAgain={fetchchatAgain}
        setfetchchatAgain={setfetchchatAgain}
      />
    </Box>
  );
};

export default ChatBox;
