import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={2}
      borderRadius={"large"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      background="purple"
      cursor="pointer"
      color={"white"}
    >
      {user.name}
      <CloseIcon pl={2} onClick={handleFunction} />
    </Box>
  );
};

export default UserBadgeItem;
