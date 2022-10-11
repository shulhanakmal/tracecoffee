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
  SimpleGrid,
  Stack,
  Select,
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
import axios from "axios";
import moment from "moment";

const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  {
    Header: "PO Number",
    accessor: "po",
  },
  {
    Header: "Processor",
    accessor: "processor",
  },
];

// const data = [
//   {
//     no: "1",
//     po_number: "14/010/21/GB-AD",
//     buyer_name: "Jimly",
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

export default function PO() {
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  
  const [data, setData] = useState([]);
  const [processor, setProcessor] = useState(null);
  const [selectProcessor, setSelectProcessor] = useState(null);
  const [po, setPo] = useState(null);

  const token = users.token;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  const getDataProcessor = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-processor`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        var arr = [];
        await res.data.processor.forEach(async function (value, index) {

          arr.push({
            processor_id: value.id,
            processor_name: value.processor_name
          });

          setProcessor(arr);
        });
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  const getDataPo = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-po`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        var arr = [];
        await res.data.po.forEach(async function (value, index) {
          arr.push({
            no: index+1,
            po: value.po_number,
            processor: value.get_processor.processor_name
          });

          setData(arr);
        });
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  const submitPo = async (e) => {

    if (po && selectProcessor) {
      var postData = {
        processor: selectProcessor,
        po_number: po,
      };

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertPo`,
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
    getDataProcessor();
    getDataPo();
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
              <Heading size="lg">PO Data</Heading>
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
                    Add PO Data
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
                {data.length} PO
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
              <Heading size="lg">Purchase Order Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>PO Number</FormLabel>
                    <Input type="text" onChange={(e) => setPo(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Processor</FormLabel>
                    <Select 
                      placeholder="Select Processor"
                      onChange={(e) => setSelectProcessor(e.target.value)}
                    >
                      {processor && processor.map((row, index) => (
                        <option key={index} value={row.processor_id} > {row.processor_name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => submitPo()} mr="3">
                Add
              </Button>
              <Button colorScheme="red">Reset</Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
