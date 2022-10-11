import { ReactNode } from "react";
import {
  Box,
  Center,
  Flex,
  Avatar,
  HStack,
  Heading,
  Link,
  IconButton,
  Button,
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

const NavLink = () => (
  <>
    {/* <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    Dashboard
  </Link> */}
  </>
);

export default function Header(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onLogoutClicked = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    props.onLogoutClicked();
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
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink />
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Heading as="em" size="md" color="grey"> Hello Processor </Heading>
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

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
