import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast,
  FormControl,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvater/UserListItem";
import UserBadgeItem from "../UserAvater/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupchatName, setgroupchatName] = useState("");
  const [selecteduser, setselectedusers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const { chat, setchat, user } = ChatState(); // here this is import from context api

  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      setsearchresult([]);
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/Chatuser?search=${search}`, config);
      setloading(false);
      setsearchresult(data);
    } catch (error) {
      toast({
        title: "User is not found ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGroup = (usertoadd) => {
    if (selecteduser.includes(usertoadd)) {
      toast({
        title: "user already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setselectedusers([...selecteduser, usertoadd]);
  };
  const handleDelete = (deluser) => {
    setselectedusers(selecteduser.filter((sel) => sel._id !== deluser._id));
  };
  const handleSubmit = async () => {
    if (!groupchatName || !selecteduser.length) {
      toast({
        title: "please fill all the fields",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        name: groupchatName,
        users: JSON.stringify(selecteduser.map((u) => u._id)),
      };
      console.log(payload); // Log the payload
      const { data } = await axios.post("/chats/group", payload, config);
      setchat([data, ...chat]);
      onClose();
      toast({
        title: "Group Created Sucessfully",
        status: "Sucess",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to created a chat ",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"worksans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder=" Chat Name"
                mb={3}
                onChange={(e) => setgroupchatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Person"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {selecteduser.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
            {loading ? (
              <div>loading</div>
            ) : (
              searchresult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              background="red"
              color={"white"}
              mr={3}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
