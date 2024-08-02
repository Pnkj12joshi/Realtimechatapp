import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        display={"flex"}
        pb={1}
        width="100%"
        alignItems={"center"}
        color="black"
        borderRadius="large"
      >
        <Avatar mr={2} size="sm" cursor={"pointer"} name={user.name} />
        <Box>
          <Text> {user.name}</Text>
          <Text fontSize="xs">
            <b> email:</b> {user.email}{" "}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
