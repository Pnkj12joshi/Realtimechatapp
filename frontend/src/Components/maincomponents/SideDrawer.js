import {
  Avatar,
  Box,
  Button,
  Drawer,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import { useDisclosure, Input } from "@chakra-ui/react";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Chatloading from "./Chatloading";
import UserListItem from "../UserAvater/UserListItem";
import { getSender } from "../../Config/Chatlogic";

import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingchat, setloadingchat] = useState();
  const {
    user,
    setselectedchat,
    chat,
    setchat,
    notification,
    setnotification,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const Handlesearch = async () => {
    if (!search) {
      toast({
        title: "Please enter the value for search",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //here we retrive token from "user" which is define in context api
        },
      };

      const { data } = await axios.get(`/Chatuser?search=${search}`, config);
      setloading(false);
      setsearchresult(data);
    } catch (error) {
      toast({
        title: "Api didn't fetch",

        status: "error",
        duration: 9000,
        isClosable: true,
        position: "left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setloadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`, //here we retrive token from "user" which is define in context api
        },
      };
      const { data } = await axios.post("/chats", { userId }, config);
      if (!chat.find((c) => c._id === data._id)) setchat([data, ...chat]);
      setselectedchat(data);
      setloadingchat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "left",
      });
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        p="5px 10px 5px 10px"
        alignItems="center"
        bg={"white"}
        borderWidth="5px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text
              display={{ base: "none", md: "flex" }}
              p="10px"
              onClick={onOpen}
            >
              {" "}
              Search User
            </Text>{" "}
            {/* here base for small screen and md for midium and large screen */}
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          {" "}
          Chat With Me
        </Text>
        <Box display="flex" alignItems="center">
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCAlE}
              />
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new Mesaage "}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setselectedchat(notif.chat);
                    setnotification(notif.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in  ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.user)}`}
                  {/* this is a logic for group chat notification */}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {user && <Avatar size="sm" cursor="pointer" name={user.name} />}
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem> My Profile </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logouthandler}> Log-Out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search </DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name and email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button variant={"ghost"} onClick={Handlesearch}>
                {" "}
                <SearchIcon />
              </Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchresult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingchat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
