import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "./Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "./maincomponents/SideDrawer";
import MyChats from "./maincomponents/MyChats";
import ChatBox from "./maincomponents/ChatBox";

const ChatPage = () => {
  const { user } = ChatState(); // here i am destucture ChatState
  const [fetchchatAgain, setfetchchatAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchchatAgain={fetchchatAgain} />}
        {user && (
          <ChatBox
            fetchchatAgain={fetchchatAgain}
            setfetchchatAgain={setfetchchatAgain}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
