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
  Select,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
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
import {
  Select as SelectM,
} from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { create } from "ipfs-http-client";
import axios from 'axios';
import moment from 'moment';

const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  // {
  //   Header: "SKU Green Bean",
  //   accessor: "sku_green_bean",
  // },
  {
    Header: "Harvesting Year",
    accessor: "harvesting_year",
  },
  {
    Header: "Po Number",
    accessor: "po_number",
  },
  {
    Header: "Batch Number",
    accessor: "batch_number",
  },
  {
    Header: "Species",
    accessor: "species",
  },
  {
    Header: "Variety",
    accessor: "variety",
  },
  {
    Header: "Process",
    accessor: "process",
  },
  {
    Header: "Date",
    accessor: "date",
  },
];

// const data = [
//   {
//     no: "1",
//     sku_green_bean: "KKAD--1000-GB-GAYO-SEMI",
//     harvesting_year: "Feb-2021",
//     batch_number: "211002",
//     species: "Arabica, Robusta, Liberica",
//     variety: "Arabica Ateng Mix",
//     process: "SEMI WASH",
//     volume_order: "10 Kg",
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

export default function Batch() {
  let users = JSON.parse(localStorage.getItem('users'));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");

  const [data, setData] = useState([]);
  const [selectPo, setSelectPo] = useState(null);
  const [selectSku, setSelectSku] = useState(null);
  const [po, setPo] = useState(null);
  const [sku, setSku] = useState([]);
  const [harvest, setHarvest] = useState(null);
  const [batch, setBatch] = useState(null);
  const [species, setSpecies] = useState(null);
  const [variety, setVariety] = useState(null);
  const [processName, setProcessName] = useState(null);
  const [hidden, setHidden] = useState(true);
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

  const getDataBatch = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-batch`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {
      var arr = [];

      await res.data.batch.forEach(async function (value, index) {

        arr.push(
          {
            "no" : index+1,
            "harvesting_year" : moment(value.harvesting_year).format('MMMM-YYYY'),
            "po_number" : `${value.po_number}`,
            "batch_number" : `${value.batch_number}`,
            "species" : `${value.species}`,
            "variety" : `${value.variety}`,
            "process" : `${value.process_name}`,
            "date" : moment(value.created_at).format('DD / MMM / YYYY H:mm:s')
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
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-batch-form`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {
      setSelectPo(res.data.data.po);
      
      var arr = [];
      await res.data.data.sku.forEach(async function (value, index) {
        arr.push({
          id: value.id,
          sku: value.sku,
          // "link_maps" : <Badge variant='solid' colorScheme='green'><a target='_blank' href={value.link_maps}> Maps</a> </Badge>,
          sku_name: value.sku_name,
          date: moment(value.created_at).format("DD / MMM / YYYY"),
        });
      });

      console.log('cek sku arr', arr);
      setSelectSku(arr);

    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

  }

  const submitBatch = async () => {

    if (po,sku.length > 0,harvest,batch,species,variety,processName) {
      var postData = {
        po_number: po,
        sku_number: sku,
        harvesting_year: harvest,
        batch_number: batch,
        species: species,
        variety: variety,
        process: processName
      };

      console.log('cek masuk');

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertBatch`,
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

  const handleSelectSku = async (e) => {
    
    let v = e;
    await setSku(e);

  };

  useEffect(() => {
    getDataBatch();
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
              <Heading size="lg">Batch Data</Heading>
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
                    Add Batch Data
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
                {data.length} Batch
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
        onClose={() => {
          setHidden(true);
          onClose();
        }}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Text size="xs">Add</Text>
              <Heading size="lg">Batch Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>PO Number</FormLabel>
                    <Select 
                      placeholder="Select PO Number"
                      onChange={(e) => setPo(e.target.value)}
                    >
                      {selectPo && selectPo.map((row, index) => (
                        <option key={index} value={row.po_number} > {row.po_number}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU Green Bean</FormLabel>
                    <SelectM
                      ismulti
                      colorScheme="purple"
                      onChange={(e) => handleSelectSku(e)}
                      options={
                        selectSku && selectSku.map(function(rows, i) {
                          return (
                            {
                              label: `${rows.sku} - ${rows.sku_name}`,
                              value: `${rows.sku}`,
                            }
                          );
                        })
                      }
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Harvesting Year</FormLabel>
                    <Input
                      placeholder="Select Date and Time"
                      size="md"
                      type="date"
                      onChange={(e) => setHarvest(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Batch Number Green Bean</FormLabel>
                    <Input type="text" onChange={(e) => setBatch(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Spesies</FormLabel>
                    <Select onChange={(e) => setSpecies(e.target.value)} placeholder="Select Spesies">
                      <option value="Arabica">Arabica</option>
                      <option value="Robusta">Robusta</option>
                      <option value="Liberica">Liberica</option>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Variety</FormLabel>
                    <Input type="text" onChange={(e) => setVariety(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Process Name</FormLabel>
                    <Input type="text" onChange={(e) => setProcessName(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => submitBatch()} mr="3">
                Add
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
