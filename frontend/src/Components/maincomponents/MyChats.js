import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import Chatloading from "./Chatloading";
import { getSender } from "../../Config/Chatlogic";
import GroupChatModel from "./GroupChatModel";

function MyChats({ fetchchatAgain }) {
  const [loggeduser, setloggeduser] = useState();
  const { user, setselectedchat, chat, selectedchat, setchat } = ChatState();
  const toast = useToast();
  const fetchchat = async (userid) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //here we retrive token from "user" which is define in context api
        },
      };
      const { data } = await axios.get("/chats", config);

      setchat(data);
    } catch (eror) {
      toast({
        title: "No Chat found",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "left",
      });
    }
  };
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchat();
  }, [fetchchatAgain]);
  return (
    <Box
      d={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box>
        {chat ? (
          <Stack overflow="scroll">
            {chat.map((chat) => (
              <Box
                onClick={() => setselectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggeduser, chat.user)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
