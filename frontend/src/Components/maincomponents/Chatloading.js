import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const Chatloading = () => {
  return (
    <div>
      <Stack>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    </div>
  );
};

export default Chatloading;
