import React from "react";
import { Avatar, IconButton, useDisclosure } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // here useDisclosure is the hook  which is used to open and close the state of components.

  return (
    <>
      {children ? (
        <div onClick={onOpen}>{children}</div> //here onOpen is used to open the model or Drawer or the component and onOpen set isOpen true.
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        {" "}
        {/*  here model is visibile when isOpen is true*/}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontFamily={"work Sans"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display={"flex"}
            flexDir="column"
            justifyContent={"space-between"}
            alignItems="center"
            p={1}
            margin={"5px"}
          >
            <Avatar />
            {user.email}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
