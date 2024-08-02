import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo"));
    if (info) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg={"white"}
        width="100%"
        margin="40px 0px 15px 0"
        borderRadius="lg"
      >
        <Text fontFamily="work sans" fontSize="4xl">
          {" "}
          Chat with me
        </Text>
      </Box>
      <Box bg="white" p={4} width="100%" borderRadius="lg">
        <Tabs variant="soft-rounded">
          <TabList marginBottom="10px">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
