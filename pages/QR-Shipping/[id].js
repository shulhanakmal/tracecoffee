import React, { useState, useEffect } from "react";
import {
  Avatar,
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
  Select,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function QrBatch() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const getDataBatch = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-qr-shipping/${id}`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
      }
    }).then(async (res) => {

      setData(res.data);
      console.log('cek data', res.data);

    }, (err) => {
        console.log("AXIOS ERROR: ", err.message);
    });

  }

  useEffect(() => {
    if(id) {
        getDataBatch();
    }
  }, [id]);

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
              <Box overflowX="auto">
                <Stack
                  spacing="4"
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  justify="space-between"
                >
                  {" "}
                  <Heading size="lg">Shipping</Heading>
                  <HStack>
                    <FormControl
                      minW={{
                        md: "320px",
                      }}
                      id="search"
                    >
                    </FormControl>
                    <Image src="/images/logo/Logo Kopi Ketjil.png" maxW="100px" />
                  </HStack>
                </Stack>
                <TableContainer>
                  <Table my="8" borderWidth="1px" fontSize="sm">
                    <Thead >
                      <Tr >
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > Shipping</Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                      </Tr>
                      <Tr bg={useColorModeValue("gray.50", "gray.800")}>
                            <Th whiteSpace="nowrap" scope="col" > Date Of Shipping</Th>
                            <Th whiteSpace="nowrap" scope="col" > Country Of Origin</Th>
                            <Th whiteSpace="nowrap" scope="col" > ICO Certificate Of Orgin</Th>
                            <Th whiteSpace="nowrap" scope="col" > Invoice And Packing List</Th>
                            <Th whiteSpace="nowrap" scope="col" > Phytosanitary Certificate</Th>
                            <Th whiteSpace="nowrap" scope="col" > Bill Of Lading</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td> {moment(data.shipping.date_shipping).format("DD / MMM / YYYY")} </Td>
                        <Td> <a target="_blank" cursor="pointer" href={data.shipping.country_origin}> <Avatar size={"lg"} src={data.shipping.country_origin} /> </a> </Td>
                        <Td> <a target="_blank" cursor="pointer" href={data.shipping.ico}> <Avatar size={"lg"} src={data.shipping.ico} /> </a> </Td>
                        <Td> <a target="_blank" cursor="pointer" href={data.shipping.invoice}> <Avatar size={"lg"} src={data.shipping.invoice} /> </a> </Td>
                        <Td> <a target="_blank" cursor="pointer" href={data.shipping.phytosanitary}> <Avatar size={"lg"} src={data.shipping.phytosanitary} /> </a> </Td>
                        <Td> <a target="_blank" cursor="pointer" href={data.shipping.bill_of_lading}> <Avatar size={"lg"} src={data.shipping.bill_of_lading} /> </a> </Td>
                      </Tr>
                    </Tbody>
                      <Tr><Td></Td></Tr>
                    {/* <Thead >
                        <Tr>
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > SKU</Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                        </Tr>
                    </Thead> */}
                    <Tbody>
                        {data.sku.map((row, index) => (
                            <>
                                <Tr>
                                    <Td bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col"><b> SKU : {row.sku} - {row.sku_name}</b></Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td></Td>
                                    <Td></Td>
                                </Tr>
                                <Tr bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap">
                                    <Th scope="col" > Batch Number</Th>
                                    <Th scope="col" > Harvesting Year</Th>
                                    <Th scope="col" > Species</Th>
                                    <Th scope="col" > Variety</Th>
                                    <Th scope="col" > Process</Th>
                                    <Th scope="col" > Qr </Th>
                                </Tr>
                                {row.get_batch.map((row, index) => (
                                    <Tr>
                                        <Td>{row.batch_number}</Td>
                                        <Td>{row.harvesting_year}</Td>
                                        <Td>{row.species}</Td>
                                        <Td>{row.variety}</Td>
                                        <Td>{row.process_name}</Td>
                                        <Td><a target="_blank" cursor="pointer" href={row.qr}> <Avatar size={"lg"} src={row.qr} /> </a></Td>
                                    </Tr>
                                ))}
                            </>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
    
        </>
    );
  } else {
    return (
        <>
            <br></br>
            <br></br>
            <Center>
                Please Wait..
            </Center>
        </>
    )
  }

}
