import { ReactNode, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Center,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onLogoutClicked = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    window.open("/login", "_self");
  };

  return (
    <>
      <Box bg="#CAF0F8" px={4} boxShadow="lg">
        <Flex h={28} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Image src="/images/logo/Logo Kopi Ketjil.png" maxW="150px" />
          </HStack>
          <Flex alignItems={"center"}>
            <Heading as="em" size="md" color="grey"> Hello Farmer </Heading>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={"/images/logo/favicon-kopiketjil.png"}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onLogoutClicked}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
