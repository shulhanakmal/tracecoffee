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
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  SimpleGrid,
  Stack,
  Spacer,
  Spinner,
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
import Link from 'next/link';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react';

const Overlay = (props) => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

export default function SKU() {
  let users = JSON.parse(localStorage.getItem("users"));
  const [checkedItems, setCheckedItems] = useState([false, false, false]);
  const [checkedDataIds, setCheckedDataIds] = useState([]);
  const { isOpen: isAddSkuOpen, onOpen: onAddSkuOpen, onClose: onAddSkuClose } = useDisclosure();
  const { isOpen: isPostSkuOpen, onOpen: onPostSkuOpen, onClose: onPostSkuClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  const [check, setCheck] = useState([]);
  const [dataPostBc, setDataPostBc] = useState(null);
  const [checkAvail, setCheckAvail] = useState([]);
  const [data, setData] = useState([]);
  const [sku, setSku] = useState(null);
  const [skuName, setSkuName] = useState(null);
  const [dataBlockchain, setDataBlockchain] = useState([]);
  const [arrBSID, setArrBCSID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataPosted, setDataPosted] = useState(0);

  const token = users.token;
  const userId = users.user.id;
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onAddSkuOpen();
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const postDataSku = async (e) => {

    var postData = {
      sku_id: check
    };
    let dataReady = false;

    console.log('sku id', check);

    await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-skuSelected`,
      data: postData,
      headers: {
        "Content-Type": `application/json`,
        "Accept": `application/json`,
        "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {

      
      if(res.data.success) {
        await setDataPostBc(res.data.data);
        dataReady = true;
        console.log('cek data', res.data.data);
      }

    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

    event.target.value = null;
    setOverlay(<Overlay />);
    onPostSkuOpen();
  };

  const getDataSku = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-sku`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.sku);
        setDataBlockchain(res.data.blockchain);
        setArrBCSID(res.data.bc);

        let skuId = res.data.sku.map(row => row.id);
        let arr = [];

        skuId.map((v, i) => {
          
          if(res.data.bc.indexOf( v ) == -1) {

            arr.push(v);

          } else {
            // console.log('cek v', v);
          }

        })

        // handle duplicates
        arr.forEach(element => {
          if (!checkAvail.includes(element)) {
            checkAvail.push(element);
          }
        });

      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  const submitSku = async (e) => {

    if (sku && skuName) {
      var postData = {
        sku: sku,
        sku_name: skuName,
      };

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertSku`,
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

  const insertQueue = async () => {

    await dataPostBc.forEach(async function (dataP, index) {

      // insert transaction log to database
      try {
        let postData = {
          flag: 'Sku',
          flag_id: dataP.id,
          flag_desc: dataP.sku,
          status: 'Waiting',
          status_remark: 'Waiting post to blockchain',
          user_id: userId
        };

        await axios({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_URL_API}/insertLogBlockchain`,
          data: postData,
          headers: {
              "Content-Type": `application/json`,
              "Accept": `application/json`,
              // "Authorization": `Bearer ${token}`
          }
        }).then(async (res) => {

          dataPosted++;
          setLoading(false);
          onPostSkuClose();
          window.location.reload();

        }, (err) => {
            console.log("AXIOS ERROR: ", err.message);
        });
      } catch (e) {
        alert(e.message);
      }
      // end insert transaction log to database

    });

  }

  const handlePostSku = async () => {

    // loading spinner
    setLoading(true);

    await insertQueue();

  }

  const handleReset = async () => {

    await setCheckedDataIds([]);
    await setCheck([]);

  }

  const handleCheck = (index, e, val) => {
  // const handleCheck = (e, val) => {

    setCheckedItems([e.target.checked, e.target.checked]);

    if(check.indexOf( val ) == -1) {
      check.push(val);
    } else {
      check.splice(check.indexOf(val), 1);
    }

  }

  useEffect(() => {
    getDataSku();
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
              <Heading size="lg">SKU Data</Heading>
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
                    Add SKU Data
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
                    <Th whiteSpace="nowrap" scope="col"> No </Th>
                    <Th whiteSpace="nowrap" scope="col"> Sku </Th>
                    <Th whiteSpace="nowrap" scope="col"> Sku Name </Th>
                    <Th whiteSpace="nowrap" scope="col"> Date Created </Th>
                    <Th whiteSpace="nowrap" scope="col"> 
                      <HStack>
                        <Checkbox
                          isChecked={
                            checkedDataIds.length ===
                            checkAvail.map(row => row.id).length
                          }
                          onChange={async () => {
                            const dataIds = checkAvail.map(row => row.id);

                            if (checkedDataIds.length === dataIds.length) {
                              await setCheckedDataIds([]);
                              await setCheck([]);
                            } else {
                              await setCheckedDataIds(checkAvail);
                              await setCheck(checkAvail);
                            }

                          }}
                        > All
                        </Checkbox>
                        <Button
                          size="sm"
                          colorScheme="orange"
                          onClick={() => handleReset()}
                        >
                          Reset
                        </Button>
                      </HStack>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row, index) => (
                    <Tr key={index}>
                      <Td> {index+1} </Td>
                      <Td> {row.sku} </Td>
                      <Td> {row.sku_name} </Td>
                      <Td> {moment(row.created_at).format('DD / MMM / YYYY H:mm:s')} </Td>
                      <Td>

                        {(() => {
                          // jika data sku sudah ditulis ke blockchain
                          if(arrBSID.indexOf( row.id ) == -1 ) {
                            return(
                              <Center>
                                <Link href={`/exportir/product/edit/${encodeURIComponent(row.id)}`} passHref={true}>
                                  <Button variant="outline" size="sm"  colorScheme="aqua">
                                    Edit
                                  </Button>
                                </Link>
                                &nbsp;&nbsp;
                                <Checkbox
                                  isChecked={checkedDataIds.includes(row.id)}
                                  onChange={event => {
                                    event.stopPropagation();
                                    const index = checkedDataIds.indexOf(row.id);
                                    handleCheck(index, event, row.id);

                                    if (index > -1) {
                                      setCheckedDataIds([
                                        ...checkedDataIds.slice(0, index),
                                        ...checkedDataIds.slice(index + 1)
                                      ]);
                                    } else {
                                      setCheckedDataIds([
                                        ...checkedDataIds,
                                        row.id
                                      ]);
                                    }
                                  }}
                                ></Checkbox>

                              </Center>
                            )
                          } else {
                            return(
                              <Center>
                                <Link href={`/exportir/product/preview/${encodeURIComponent(row.id)}`} passHref={true}>
                                  <Button variant="outline" size="sm"  colorScheme="yellow">
                                    Preview
                                  </Button>
                                </Link>
                              </Center>
                            )
                          }
                        })()}

                        {/* <Center>
                          <Link href={`/exportir/product/preview/${encodeURIComponent(row.id)}`} passHref={true}>
                            <Button variant="outline" size="sm"  colorScheme="yellow">
                              Preview
                            </Button>
                          </Link>
                          &nbsp;&nbsp;
                          <Link href={`/exportir/product/edit/${encodeURIComponent(row.id)}`} passHref={true}>
                            <Button variant="outline" size="sm"  colorScheme="blue">
                              Edit
                            </Button>
                          </Link>
                        </Center> */}

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
                {data.length} SKU
              </Text>
              <ButtonGroup variant="outline" size="sm">
                {/* <Button as="a" rel="prev">
                  Previous
                </Button>
                <Button as="a" rel="next">
                  Next
                </Button> */}
                <Button as="a" rel="next" colorScheme="blue" cursor="pointer" onClick={(event) => postDataSku(event)} >
                  Post
                </Button>
              </ButtonGroup>
            </Flex>
          </Box>

          <br></br>
          <hr></hr>
          <br></br>
          
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
              <Heading size="lg">Blockchain</Heading>
            </Stack>
            <TableContainer>
              <Table my="8" borderWidth="1px" fontSize="sm">
                <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                  <Tr>
                    <Th> No </Th>
                    <Th> Status </Th>
                    <Th> Description </Th>
                    <Th> Block Number </Th>
                    <Th> Transaction </Th>
                    <Th> SKU </Th>
                    <Th> SKU ID </Th>
                    <Th> Created_at </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataBlockchain.map((row, index) => (
                    <Tr key={index}>
                      <Td> {index+1} </Td>
                      <Td> {row.status} </Td>
                      <Td> {row.status_remark} </Td>
                      <Td> {row.block_no} </Td>
                      {/* <Td> <Badge variant='solid' cursor="pointer" colorScheme='green' title={row.transaction_hash}><a target='_blank' href={`https://mumbai.polygonscan.com/tx/${row.transaction_hash}`}> Hash</a> </Badge></Td> */}
                      <Td> 
                        {(() => {
                          if(row.status != 'Success') {
                            return (
                              <Td> </Td>
                            )
                          } else {
                            return (
                              <Td> <Badge variant='solid' cursor="pointer" colorScheme='green' title={row.transaction_hash}><a target='_blank' href={`https://mumbai.polygonscan.com/tx/${row.transaction_hash}`}> Hash</a> </Badge></Td>
                            )
                          }
                        })()}
                      </Td>
                      <Td> {row.flag_desc} </Td>
                      <Td> {row.flag_id} </Td>
                      <Td> {moment(row.created_at).format('DD / MMM / YYYY H:mm:s')} </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

        </Box>
      </Box>


      <Modal
        isCentered
        isOpen={isAddSkuOpen}
        onClose={onAddSkuClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Text size="xs">Add</Text>
              <Heading size="lg">Product Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU Green Bean</FormLabel>
                    <Input type="text" onChange={(e) => setSku(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU GB Name</FormLabel>
                    <Input type="text" onChange={(e) => setSkuName(e.target.value)} name="tanggalTransaksi" />
                  </FormControl>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => submitSku()} mr="3">
                Add
              </Button>
              <Button colorScheme="red">Reset</Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        isOpen={isPostSkuOpen}
        onClose={onPostSkuClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Center>
                <Heading size="lg">Post SKU Selected</Heading>
              </Center>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <Center>
                    <HStack spacing={8} alignItems={"center"}>
                      {(() => {
                        if(loading) {
                          return (
                            <>
                              <Box>
                                <Center>
                                  <HStack spacing={8} alignItems={"center"}>
                                    <Spinner
                                      thickness='4px'
                                      speed='0.65s'
                                      emptyColor='gray.200'
                                      color='blue.500'
                                      size='xl'
                                    />
                                  </HStack>
                                </Center>
                              </Box>
                              <Box>
                                <Center>
                                  <HStack spacing={8} alignItems={"center"}>
                                    <Text>Please Wait...</Text>
                                    </HStack>
                                </Center>
                              </Box>
                            </>
                          )
                        } else {
                          return (
                            <Image src="https://cdn3d.iconscout.com/3d/premium/thumb/polygon-4976786-4159452.png" maxW="150px" />
                          )
                        }
                      })()}
                    </HStack>
                  </Center>
                </Box>
                <Box>
                  <FormControl >
                    <Text>You are going to approve 1 operations and want to send the information to the blockchain to be stored there forever and ever until the end of times</Text>
                  </FormControl>
                </Box>
              </SimpleGrid>
              <br></br>
              <hr></hr>
              <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                <Box>
                  <Flex>
                    <Box p='4'>
                      {/* <Button colorScheme="gray" onClick={() => onPostSkuClose()} mr="3">
                        Cancel
                      </Button> */}
                    </Box>
                    <Spacer />
                    <Box p='4'>
                      {(() => {
                        if(loading) {
                          return (
                            <Button colorScheme="blue" disabled mr="3">
                              Approve
                            </Button>
                          );
                        } else {
                          return (
                            <Button colorScheme="blue" onClick={() => handlePostSku()} mr="3">
                              Approve
                            </Button>
                          );
                        }
                      })()}
                    </Box>
                  </Flex>
                </Box>
              </SimpleGrid>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
