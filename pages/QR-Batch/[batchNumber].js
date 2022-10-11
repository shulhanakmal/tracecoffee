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
  const { batchNumber } = router.query;
  const [data, setData] = useState(null);

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const getDataBatch = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-qr-batch/${batchNumber}`,
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
    if(batchNumber) {
        getDataBatch();
    }
  }, [batchNumber]);

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
                  <Heading size="lg">Batch - {batchNumber}</Heading>
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
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > Batch</Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                      </Tr>
                      <Tr bg={useColorModeValue("gray.50", "gray.800")}>
                            <Th whiteSpace="nowrap" scope="col" > Batch Number</Th>
                            <Th whiteSpace="nowrap" scope="col" > Harvesting Year</Th>
                            <Th whiteSpace="nowrap" scope="col" > Species</Th>
                            <Th whiteSpace="nowrap" scope="col" > Variety</Th>
                            <Th whiteSpace="nowrap" scope="col" > Process</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td> {data.batch.batch_number} </Td>
                        <Td> {data.batch.harvesting_year} </Td>
                        <Td> {data.batch.species} </Td>
                        <Td> {data.batch.variety} </Td>
                        <Td> {data.batch.process_name} </Td>
                      </Tr>
                    </Tbody>
                      <Tr><Td></Td></Tr>
                    <Thead >
                        <Tr>
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > Purchase Order</Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > SKU</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>{data.po.po_number}</Td>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                            <Td>{data.sku.sku} - {data.sku.sku_name}</Td>
                        </Tr>
                    </Tbody>
                    <Tr><Td></Td></Tr>
                    <Thead >
                        <Tr>
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > Processor</Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                        </Tr>
                        <Tr>
                            <Td>{data.processor.processor_name}</Td>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                        </Tr>
                    </Thead>
                    <Tr><Td></Td></Tr>
                    <Thead >
                        <Tr>
                            <Th bg={useColorModeValue("gray.50", "gray.800")} whiteSpace="nowrap" scope="col" > Farm</Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                            <Th scope="col" > </Th>
                        </Tr>
                    </Thead>
                    <Tbody >
                    {data.farm.map((row, index) => (
                        <Tr>
                            <Td>{row.farm_location}</Td>
                            <Td>{row.elevation} MASL</Td>
                            {/* <Td>{row.latitude} - {row.longitude}</Td> */}
                            <Td> <Badge variant='solid' colorScheme='green'><a target='_blank' href={row.link_maps}> Maps</a> </Badge> </Td>
                            <Td>  </Td>
                            <Td></Td>
                        </Tr>
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
