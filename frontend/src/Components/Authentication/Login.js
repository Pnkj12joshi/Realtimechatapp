import { VStack, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // it is a function of react router dom

  const SubmitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill the field",

        status: "Warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/Login", { email, password }, config);
      toast({
        title: "Login Sucessful",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);

      navigate("/chats");
    } catch (error) {
      toast({
        title: "Please try again Later",
        description: `error: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  const guestLoginHandler = () => {
    setemail("guest123@gmail.com");
    setpassword("123456");
    navigate("/chats");
  };
  return (
    <VStack>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="email"
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input
          type="Password"
          placeholder="password"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={loading}
      >
        Signin
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={guestLoginHandler}
      >
        Guest Login
      </Button>
    </VStack>
  );
};

export default Login;
