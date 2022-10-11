import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import axios from "axios";
import moment from "moment";
import { useRouter } from 'next/router';
import Link from 'next/link';

const product_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState(null);

  const token = users.token;

  const getDataSku = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-sku/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.sku);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataSku();
    } else {
      return;
    }
  }, []);

  if(data) {
    return (
        <>
          <Box as="section" py="12">
            <Box
              mx="auto"
              bg={useColorModeValue("white", "gray.700")}
              borderRadius="lg"
              p="10"
              color={useColorModeValue("gray.700", "whiteAlpha.900")}
              shadow="base"
              w="90vw"
            >
              <Box >
                <Heading size="lg">Product Preview</Heading>
              </Box>
              <br></br>
              <hr></hr>
              <br></br>
              <Box>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>SKU : <b>{data.sku}</b></FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl >
                      <FormLabel>SKU Name : <b>{data.sku_name}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
    
                <br></br>
                <hr></hr>
    
                <Flex align="right" justify="space-between">
                  <Box p='4'>
                    <Link href={`/exportir/product`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="grey">
                        Back
                      </Button>
                    </Link>
                  </Box>
                  <Box p='4'>
                    {/* <Link href={`/exportir/product/edit/${encodeURIComponent(data.id)}`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="yellow">
                        Edit
                      </Button>
                    </Link> */}
                  </Box>
                </Flex>
    
              </Box>
            </Box>
          </Box>
        </>
    );
  } else {
    return(
        <>
            <Center>
                <br></br>
                <br></br>
                Please Wait...
            </Center>
        </>
    )
  }

}

export default product_preview
