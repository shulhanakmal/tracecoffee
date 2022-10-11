import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Select,
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
  useDisclosure,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Field, FieldArray } from "formik";
import axios from 'axios';
import moment from 'moment';

const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  {
    Header: "SKU Green Bean",
    accessor: "sku_gb",
  },
  {
    Header: "Volume",
    accessor: "volume",
  },
  {
    Header: "Date Created",
    accessor: "date_created",
  },
];

// const data = [
//   {
//     no: "1",
//     sku_gb: "KKAD--1000-GB-GAYO-SEMI",
//     volume: "10 Kg",
//     date_created: "13/Mar/2021",
//   },
// ];

const Overlay = (props) => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

export default function Packaging() {
  let users = JSON.parse(localStorage.getItem('users'));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");

  const [data, setData] = useState([]);
  const [selectSku, setSelectSku] = useState(null);
  const [sku, setSku] = useState(null);
  const [volume, setVolume] = useState(null);
  const token = users.token;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const getDataPackaging = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-packaging`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {
      
      console.log('cek array', res);
      
      var arr = [];
      await res.data.packaging.forEach(async function (value, index) {

        arr.push(
          {
            "no" : index+1,
            "sku_gb" : value.sku,
            "volume" : `${value.volume}`,
            "date_created" : moment(value.created_at).format('DD / MMM / YYYY H:mm:s')
          }
        );

        setData(arr);

      });

    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

  }

  const getDataForm = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-packaging-form`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {

      setSelectSku(res.data.data);

    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

  }

  const submitPackaging = async () => {

    if (sku, volume) {
      var postData = {
        sku: sku,
        volume: volume
      };

      console.log('cek masuk');

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertPackaging`,
        data: postData,
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
      }).then(
        async (res) => {
          if (res.data.success) {
            await alert("Data berhasil disimpan");
            window.location.reload();
          } else {
            alert(res.data.message);
          }
        },
        (err) => {
          console.log("AXIOS ERROR: ", err);
          alert(err.message);
        }
      );
    } else {
      alert("Harap isi data dengan lengkap");
    }

  }

  useEffect(() => {
    getDataPackaging();
    getDataForm();
  }, []);

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
              <Heading size="lg">Packaging Data</Heading>
              <HStack>
                <FormControl
                  minW={{
                    md: "320px",
                  }}
                  id="search"
                >
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <BsSearch />
                    </InputLeftElement>
                    <Input rounded="base" type="search" />
                  </InputGroup>
                </FormControl>
                <ButtonGroup size="sm" variant="outline">
                  <Button
                    iconSpacing="1"
                    leftIcon={<RiAddFill fontSize="1.25em" />}
                    onClick={(event) => addData(event)}
                  >
                    Add Packaging Data
                  </Button>
                  {/* <Button
                  iconSpacing="1"
                  leftIcon={<RiArrowRightUpLine fontSize="1.25em" />}
                >
                  Export CSV
                </Button> */}
                </ButtonGroup>
              </HStack>
            </Stack>
            <TableContainer>
              <Table my="8" borderWidth="1px" fontSize="sm">
                <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                  <Tr>
                    {columns.map((column, index) => (
                      <Th whiteSpace="nowrap" scope="col" key={index}>
                        {column.Header}
                      </Th>
                    ))}
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row, index) => (
                    <Tr key={index}>
                      {columns.map((column, index) => {
                        const cell = row[column.accessor];
                        const element = column.Cell?.(cell) ?? cell;
                        return (
                          <Td whiteSpace="nowrap" key={index}>
                            {element}
                          </Td>
                        );
                      })}
                      <Td textAlign="right">
                        <Button variant="link" colorScheme="blue">
                          Edit
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex align="center" justify="space-between">
              <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontSize="sm"
              >
                {data.length} Packaging
              </Text>
              <ButtonGroup variant="outline" size="sm">
                <Button as="a" rel="prev">
                  Previous
                </Button>
                <Button as="a" rel="next">
                  Next
                </Button>
              </ButtonGroup>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Text size="xs">Add</Text>
              <Heading size="lg">Packaging Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU Green Bean</FormLabel>
                    <Select onChange={(e) => setSku(e.target.value)} placeholder="Select Sku">
                      {selectSku && selectSku.map((row, index) => (
                        <option key={index} value={row.sku} > {row.sku} - {row.sku_name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Volume in Kilograms (Kg)</FormLabel>
                    <Select onChange={(e) => setVolume(e.target.value)} placeholder="Select Volume">
                      <option value="25 Kg">25 Kg</option>
                      <option value="30 Kg">30 Kg</option>
                      <option value="50 Kg">50 Kg</option>
                      <option value="60 Kg">60 Kg</option>
                    </Select>
                  </FormControl>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => submitPackaging()} mr="3">
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
