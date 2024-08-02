import React, { useState } from "react";
import { Button, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const SubmitHandler = async () => {
    setloading(true);
    if (!name || !email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        // in simple term we can say during api call the req header should me "json" format.
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/Signup",
        { name, email, password },
        config
      );
      toast({
        title: "Registration is sucessful",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("UserInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats"); // its help to push in /chats routes.
    } catch (error) {
      toast({
        title: "Invalid Info",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack spacing={5}>
      <FormControl id="customername">
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          placeholder="name"
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="customeremail">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="email"
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="customerpassword">
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
    </VStack>
  );
}

export default Signup;
