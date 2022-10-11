import { ReactNode, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import axios from 'axios';

export default function Header(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let users = JSON.parse(localStorage.getItem('users'));
  const token = users.token;

  const onLogoutClicked = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    props.onLogoutClicked();
    window.open("/login", "_self");
  };

  const Authorization = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/cek-login`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {

      if(!res.data.success) {
        props.onLogoutClicked();
        window.open("/login", "_self");
      }

    });

  }

  useEffect(() => {
    Authorization();
  }, []);

  const NavLink = () => (
    <>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/"
      >
        Dashboard
      </Link>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/exportir/po"
      >
        Purchase Order
      </Link>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/exportir/product"
      >
        SKU
      </Link>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/exportir/batch"
      >
        Batch
      </Link>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/exportir/packaging"
      >
        Packaging
      </Link>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href="/exportir/shipping"
      >
        Shipping
      </Link>
    </>
  );

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
            <Heading as="em" size="md" color="grey"> Hello Exporter </Heading>
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
