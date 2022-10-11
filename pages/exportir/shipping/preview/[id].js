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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Th,
  Tr,
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
  
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);

  const token = users.token;

  const getDataShipping = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-shipping/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.shipping);
        setDetail(res.data.shipping.get_detail);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataShipping();
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
              <Heading size="lg">Shipping Preview</Heading>
            </Box>
            <br></br>
            <hr></hr>
            <br></br>
            <Box>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                    <Box>
                        <FormControl >
                            <FormLabel>Date Of Shipping : <b>{moment(data.date_shipping).format("DD / MMM / YYYY")}</b></FormLabel>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl >
                            <FormLabel>Country of Origin : <b><a target="_blank" cursor="pointer" href={data.country_origin}> <Badge variant="solid" colorScheme="green"> View </Badge> </a></b></FormLabel>
                        </FormControl>
                    </Box>
                </SimpleGrid>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                    <Box>
                        <FormControl >
                            <FormLabel>ICO Certificate of Origin : <b><a target="_blank" cursor="pointer" href={data.ico}> <Badge variant="solid" colorScheme="green"> View </Badge> </a></b></FormLabel>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl >
                            <FormLabel>Invoice and Packing List : <b><a target="_blank" cursor="pointer" href={data.invoice}> <Badge variant="solid" colorScheme="green"> View </Badge> </a></b></FormLabel>
                        </FormControl>
                    </Box>
                </SimpleGrid>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                    <Box>
                        <FormControl >
                            <FormLabel>Phytosanitary Certificate : <b><a target="_blank" cursor="pointer" href={data.phytosanitary}> <Badge variant="solid" colorScheme="green"> View </Badge> </a></b></FormLabel>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl >
                            <FormLabel>Bill of Lading : <b><a target="_blank" cursor="pointer" href={data.bill_of_lading}> <Badge variant="solid" colorScheme="green"> View </Badge> </a></b></FormLabel>
                        </FormControl>
                    </Box>
                </SimpleGrid>

                <TableContainer>
                    <Table my="8" borderWidth="1px" fontSize="sm">
                        <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                            <Tr>
                                <Th> No </ Th>
                                <Th> SKU </ Th>
                                <Th> Volume </ Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {detail.map((row, index) => (
                                <Tr key={index}>
                                    <Td> {index+1} </Td>
                                    <Td> {row.sku} </Td>
                                    <Td> {row.volume} MASL (Meters Above Sea Level) </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
  
              <br></br>
              <hr></hr>
  
              <Flex align="right" justify="space-between">
                <Box p='4'>
                  <Link href={`/exportir/shipping`} passHref={true}>
                    <Button variant="outline" size="sm" colorScheme="grey">
                      Back
                    </Button>
                  </Link>
                </Box>
                <Box p='4'>
                  {/* <Link href={`/exportir/shipping/edit/${encodeURIComponent(data.id)}`} passHref={true}>
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

export default batch_preview