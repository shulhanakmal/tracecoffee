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

const batch_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState([]);
  const [sku, setSku] = useState(null);

  const token = users.token;

  const getDataBatch = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-batch/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.batch);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataBatch();
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
                <Heading size="lg">Batch Preview</Heading>
              </Box>
              <br></br>
              <hr></hr>
              <br></br>
              <Box>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>PO Number : <b>{data.get_po ? data.get_po.po_number : ''}</b></FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl >
                      <FormLabel>SKU : <b>{data.get_sku ? `${data.get_sku.sku} - ${data.get_sku.sku_name}` : ``}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>Batch Number : <b>{data.batch_number}</b></FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl >
                      <FormLabel>Harvesting Year : <b>{data.harvesting_year}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>Species : <b>{data.species}</b></FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl >
                      <FormLabel>Variety : <b>{data.variety}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>Process Name : <b>{data.process_name}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
    
                <br></br>
                <hr></hr>
    
                <Flex align="right" justify="space-between">
                  <Box p='4'>
                    <Link href={`/exportir/batch`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="grey">
                        Back
                      </Button>
                    </Link>
                  </Box>
                  <Box p='4'>
                    <a target="_blank" href={`/QR-Batch/${data.batch_number}`}>
                      <Button variant="outline" size="sm" colorScheme="green">
                        QR
                      </Button>
                    </a>
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

export default batch_preview