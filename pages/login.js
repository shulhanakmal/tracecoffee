import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Image,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import axios from 'axios';
  import Router , {useRouter}  from 'next/router';
  
  export default function Login(props) {
    const [email, setEmailChange] = useState();
    const [password, setPasswordChange] = useState();
    const router = useRouter();
  
    const onChangeEmail = (e) => {
      const value = e.target.value;
      setEmailChange(value);
    };
  
    const onChangePassword = (e) => {
      const value = e.target.value;
      setPasswordChange(value);
    };

    const handleOnLoggedIn = (role) => {
        localStorage.setItem("user", role);
        if(role == 'Farm') {
          window.open('/farm', "_self");
        } else if(role == 'Processor'){
          window.open('/processor', "_self");
        } else if(role == 'Exportir'){
          window.open('/exportir', "_self");
        } else {
          window.open("/login", "_self");
        }
    };
  
    const onLoggedIn = async () => {
      // if (password == "123456") {
      //   if (email == "Farm") {
      //     props.onLoggedIn("Farm");
      //   }
      //   if (email == "Processor") {
      //     props.onLoggedIn("Processor");
      //   }
      //   if (email == "Exportir") {
      //     props.onLoggedIn("Exportir");
      //   }
      // }
  
      var postData = {
        email: email,
        password: password
      };
      
      await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_API}/login`,
        data: postData
      }).then(async (res) => {
        if(res.data.success == false) {
          setError("Username dan Password Yang Anda Masukan Salah");
        } else {
          localStorage.setItem('users', JSON.stringify(res.data));
          localStorage.setItem('token', JSON.stringify(res.data.token));
          
          handleOnLoggedIn(res.data.user.role);
  
        }
      }, (err) => {
        console.log("AXIOS ERROR: ", err);
        alert(err.message);
      });
    };
  
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Image src="/images/logo/Logo Kopi Ketjil.png" maxW="250px" />
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" onChange={onChangeEmail} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" onChange={onChangePassword} />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"}>Forgot password?</Link>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={onLoggedIn}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  