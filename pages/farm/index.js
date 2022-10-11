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
import axios from 'axios';
import moment from 'moment';
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

export default function Farm() {
  let users = JSON.parse(localStorage.getItem('users'));
  const [checkedItems, setCheckedItems] = useState([false, false, false]);
  const [checkedDataIds, setCheckedDataIds] = useState([]);
  const { isOpen: isAddFarmOpen, onOpen: onAddFarmOpen, onClose: onAddFarmClose } = useDisclosure();
  const { isOpen: isPostFarmOpen, onOpen: onPostFarmOpen, onClose: onPostFarmClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  const [data, setData] = useState([]);
  const [dataBlockchain, setDataBlockchain] = useState([]);
  const [checkAvail, setCheckAvail] = useState([]);
  const [check, setCheck] = useState([]);
  const [dataPostBc, setDataPostBc] = useState(null);
  const [arrBFID, setArrBCFID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataPosted, setDataPosted] = useState(0);
  
  const [farmName, setFarmName] = useState(null);
  const [location, setLocation] = useState(null);
  const [ipfsLocation, setIfsLocation] = useState(null);
  const [gmapslink, setGmapsLink] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [elevation, setElevation] = useState(null);
  const token = users.token;
  const userId = users.user.id;
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const addDataFarm = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onAddFarmOpen();
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const postDataFarm = async (e) => {

    var postData = {
      farm_id: check
    };
    let dataReady = false;

    console.log('farm id', check);

    await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-farmSelected`,
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
    onPostFarmOpen();
  };

  const submitFarm = async (e) => {

    if(farmName && gmapslink && latitude && longitude && elevation) {
      var postData = {
        farm_location: farmName,
        link_maps: gmapslink,
        latitude: latitude,
        longitude: longitude,
        elevation: elevation
      };
      
      await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertFarm`,
        data: postData,
        headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
        },
      }).then(async (res) => {
        if(res.data.success) {
          await alert('Data berhasil disimpan');
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      }, (err) => {
        console.log("AXIOS ERROR: ", err);
        alert(err.message);
      });
    } else {
      alert('Harap isi data dengan lengkap');
    }

  }

  const getDataFarm = async () => {

    await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-farm`,
      headers: {
          "Content-Type": `application/json`,
          "Accept": `application/json`,
          "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {

      setData(res.data.farm);
      setDataBlockchain(res.data.blockchain);
      setArrBCFID(res.data.bc);

      let farmId = res.data.farm.map(row => row.id);
      let arr = [];

      farmId.map((v, i) => {
        
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

    }, (err) => {
        console.log("AXIOS ERROR: ", err.message);
    });

  }

  const handleCheck = (index, e, val) => {

    setCheckedItems([e.target.checked, e.target.checked]);
    console.log('cek checkedItems', checkedItems);

    if(check.indexOf( val ) == -1) {
      check.push(val);
    } else {
      check.splice(check.indexOf(val), 1);
    }

    console.log('check ', check);

  }

  const insertQueue = async () => {

    await dataPostBc.forEach(async function (dataP, index) {

      // insert transaction log to database
      try {
        let postData = {
          flag: 'Farm',
          flag_id: dataP.id,
          flag_desc: dataP.farm_location,
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
          onPostFarmClose();
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

  const handlePostFarm = async () => {

    // loading spinner
    setLoading(true);

    await insertQueue();

  }

  const handleReset = async () => {

    await setCheckedDataIds([]);
    await setCheck([]);

  }

  useEffect(() => {
    getDataFarm();
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
              <Heading size="lg">Farm Data</Heading>
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
                    onClick={(event) => addDataFarm(event)}
                  >
                    Add Farm Data
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
                    <Th>No.</Th>
                    <Th>Farm Location</Th>
                    <Th>ID</Th>
                    <Th>Link Maps</Th>
                    <Th>Latitude, Longitude</Th>
                    <Th>Elevation</Th>
                    <Th>Created At</Th>
                    <Th>
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
                      <Td> {row.farm_location} </Td>
                      <Td> {row.id} </Td>
                      <Td> <Badge variant='solid' cursor="pointer" colorScheme='green' title={row.transaction_hash}><a target='_blank' href={row.link_maps}> Maps</a> </Badge> </Td>
                      <Td> {row.latitude} - {row.longitude} </Td>
                      <Td> {row.elevation} MASL </Td>
                      <Td> {moment(row.created_at).format('DD / MMM / YYYY H:mm:s')} </Td>
                      <Td>
                          {/* <Checkbox vlue={row.id} data-farm={row} onChange={() => handleCheck(row.id)}>Select</Checkbox> */}
                          {(() => {
                            // jika data farm sudah ditulis ke blockchain
                            if( arrBFID.indexOf( row.id ) == -1 ) {
                              return(
                                <Center>
                                  <Link href={`/farm/edit/${encodeURIComponent(row.id)}`} passHref={true}>
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
                                  <Link href={`/farm/preview/${encodeURIComponent(row.id)}`} passHref={true}>
                                    <Button variant="outline" size="sm"  colorScheme="yellow">
                                      Preview
                                    </Button>
                                  </Link>
                                </Center>
                              )
                            }
                          })()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <br></br>
            {/*<br></br>
            <ButtonGroup variant="outline" size="sm">
              <Button as="a" rel="next" onClick={(event) => postDataFarm(event)} >
                Post
              </Button>
            </ButtonGroup> */}
            <Flex align="center" justify="space-between">
              <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontSize="sm"
              >
                {data.length} farm
              </Text>
              <ButtonGroup variant="outline" size="sm">
                {/* <Button as="a" rel="prev">
                  Previous
                </Button>
                <Button as="a" rel="next">
                  Next
                </Button> */}
                <Button as="a" rel="next" colorScheme="blue" cursor="pointer" onClick={(event) => postDataFarm(event)} >
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
                    <Th> Farm Location </Th>
                    <Th> Farm ID </Th>
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
        isOpen={isAddFarmOpen}
        onClose={onAddFarmClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Text size="xs">Add</Text>
              <Heading size="lg">Farm Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Farm Location</FormLabel>
                    <Input type="text" onChange={(e) => setFarmName(e.target.value)} name="farmName" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Link Google Maps Location</FormLabel>
                    <Input type="text" onChange={(e) => setGmapsLink(e.target.value)} name="mapsLink" />
                  </FormControl>
                </Box>
              </SimpleGrid>
              <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Latitude</FormLabel>
                    <Input type="text" onChange={(e) => setLatitude(e.target.value)} name="latitude" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Longitude</FormLabel>
                    <Input type="text" onChange={(e) => setLongitude(e.target.value)} name="longitude" />
                  </FormControl>
                </Box>
              </SimpleGrid>
              <SimpleGrid minChildWidth="50vw" spacing="4" mt="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Elevation</FormLabel>
                    <Input type="text" onChange={(e) => setElevation(e.target.value)} name="elevation" />
                  </FormControl>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => submitFarm()} mr="3">
                Add
              </Button>
              <Button colorScheme="red">Reset</Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        isOpen={isPostFarmOpen}
        onClose={onPostFarmClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Center>
                <Heading size="lg">Post Farm Selected</Heading>
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
                      {/* <Button colorScheme="gray" onClick={() => onPostFarmClose()} mr="3">
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
                            <Button colorScheme="blue" onClick={() => handlePostFarm()} mr="3">
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
