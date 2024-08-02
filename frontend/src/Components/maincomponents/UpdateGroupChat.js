import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserBadgeItem from "../UserAvater/UserBadgeItem";
import UserListItem from "../UserAvater/UserListItem";
import axios from "axios";

const UpdateGroupChat = ({ fetchchatAgain, setfetchchatAgain, Fetchchat }) => {
  const [groupchatName, setgroupchatName] = useState();
  const [search, setsearch] = useState();
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setrenameloading] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { user, selectedchat, setselectedchat } = ChatState(); // this is import from Chatprovider
  const { toast } = useToast();

  const handleRename = async () => {
    if (!groupchatName) return;
    try {
      setrenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/chats/rename",
        {
          chatId: selectedchat._id,
          chatName: groupchatName,
        },
        config
      );
      setselectedchat(data);
      setfetchchatAgain(!fetchchatAgain);
      setrenameloading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setrenameloading(false);
    }
  };
  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
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
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRemove = async (user1) => {
    if (selectedchat.groupAdmin._id !== user._id && user1.id !== user._id) {
      toast({
        title: "Only admin can remove someone ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/chats/groupremove",
        {
          chatId: selectedchat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setselectedchat() : setselectedchat(data);
      setfetchchatAgain(!fetchchatAgain);
      Fetchchat();
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedchat.user.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already Exist ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedchat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins can add Someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/chats/groupadd`,
        {
          chatId: selectedchat._id,
          userId: user1._id,
        },
        config
      );
      setselectedchat(data);
      setfetchchatAgain(!fetchchatAgain);
      setloading(false);
    } catch (error) {
      toast({
        title: "Failed to Add member ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  return (
    <div>
      <>
        <IconButton
          onClick={onOpen}
          icon={<ViewIcon />}
          display={{ base: "flex" }}
        >
          Open Modal
        </IconButton>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"30px"}
            >
              {selectedchat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <Box
                w={"100%"}
                display={"flex"}
                flexWrap={"wrap"}
                pb={3}
                borderRadius={"lg"}
              >
                {selectedchat.user.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>
              <FormControl display={"flex"}>
                <Input
                  placeholder="chat name"
                  mb={3}
                  value={groupchatName}
                  onChange={(e) => setgroupchatName(e.target.value)}
                />
                <Button
                  variant={"solid"}
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </FormControl>
              <FormControl display={"flex"}>
                <Input
                  placeholder="Add user to group"
                  mb={1}
                  value={groupchatName}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchresult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default UpdateGroupChat;
