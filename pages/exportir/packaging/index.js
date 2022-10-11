import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
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
import { create } from "ipfs-http-client";
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';

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
  const [checkedItems, setCheckedItems] = React.useState([false, false, false]);
  const { isOpen: isAddPackagingOpen, onOpen: onAddPackagingOpen, onClose: onAddPackagingClose } = useDisclosure();
  const { isOpen: isPostPackagingOpen, onOpen: onPostPackagingOpen, onClose: onPostPackagingClose } = useDisclosure();
  const [checkedDataIds, setCheckedDataIds] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");

  const [checkAvail, setCheckAvail] = useState([]);
  const [check, setCheck] = useState([]);
  const [dataPck, setDataPck] = useState([]);
  const [dataPckSelected, setDataPckSelected] = useState([]);
  const [dataBlockchain, setDataBlockchain] = useState([]);
  const [dataPostBc, setDataPostBc] = useState(null);
  const [arrBPID, setArrBCPID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataPosted, setDataPosted] = useState(0);
  const [pckJsonIPFS, setPckJsonIPFS] = useState(null);
  const [dataBatch, setDataBatch] = useState(null);

  const [hidden, setHidden] = useState(true);

  const [data, setData] = useState([]);
  const [selectSku, setSelectSku] = useState(null);
  const [sku, setSku] = useState(null);
  const [volume, setVolume] = useState(null);
  
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const token = users.token;
  const userId = users.user.id;

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onAddPackagingOpen();
  };

  const postDataPackaging = async (e) => {

    var postData = {
      packaging_id: check
    };
    let dataReady = false;

    await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-packagingSelected`,
      data: postData,
      headers: {
        "Content-Type": `application/json`,
        "Accept": `application/json`,
        "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {

      if(res.data.success) {
        await setDataPostBc(res.data.data);
        console.log('cek data post', res.data.data);
        dataReady = true;
      }

    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

    event.target.value = null;
    setOverlay(<Overlay />);
    onPostPackagingOpen();

  }

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

      setData(res.data.packaging);
      setDataBlockchain(res.data.blockchain);
      setArrBCPID(res.data.bc);

      let dataId = res.data.packaging.map(row => row.id);
      let arr = [];

      dataId.map((v, i) => {
        
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

  const handleSelectChange = async (e) => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-batch-by-sku/${e.target.value}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        if (res.data.success) {
          setDataBatch(res.data.batch);
        } else {
          setDataBatch(null);
        }
      },
      (err) => {
        console.log("AXIOS ERROR: ", err);
        setDataBatch(null);
        // alert(err.message);
      }
    );

    setSku(e.target.value);

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

  const insertQueue = async () => {

    await dataPostBc.forEach(async function (dataP, index) {

      // insert transaction log to database
      try {
        let postData = {
          flag: 'Packaging',
          flag_id: dataP.id,
          flag_desc: dataP.get_sku.sku,
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

          // dataPosted++;

        }, (err) => {
            console.log("AXIOS ERROR: ", err.message);
        });
      } catch (e) {
        alert(e.message);
      }
      // end insert transaction log to database

    });

    await uploadIPFS();

  }

  const handlePostPackaging = async () => {

    // loading spinner
    setLoading(true);

    await insertQueue();

  }

  const uploadIPFS = async () => {

    let count = dataPostBc.length;
    if(count > 0) {
      // dataPostBc.map(async (dataP, index) => {
      dataPostBc.forEach(async function (dataP, index) {

        var d = null;
        await axios({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_URL_API}/get-batch-packaging/${dataP.get_sku.id}`,
          headers: {
              "Content-Type": `application/json`,
              "Accept": `application/json`,
              "Authorization": `Bearer ${token}`
          }
        }).then(async (res) => {

          d = await res.data.data;

        }, (err) => {
            console.log("AXIOS ERROR: ", err.message);
        });


        // upload ke ipfs
        const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
        const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

        const fileName = "batch";
        const json = JSON.stringify(d, null, 4).replace(/[",\\]]/g, "");
        const blob = new Blob([json],{type:'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";

        const ipfsJson = null;

        // start upload batch to ipfs
        try {
          const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
          const ipfs = create(
            {
              host: 'ipfs.infura.io',
              port: 5001,
              protocol: 'https',
              headers: {
                  authorization: auth,
              },
            }
          );

          const added = await ipfs.add({ path: link.download, content: json });
          let docCid = `${added.cid}`;
          const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}`
          ipfsJson = docUrl;

          console.log('url', docUrl);
          // await setProcessorJsonIPFS(docUrl);

          // update processor to save content id ipfs to processor table
          let postData = {
            ipfs_detail: docUrl
          };
          await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_URL_API}/insert-ipfs-packaging/${dataP.id}`,
            data: postData,
            headers: {
                "Content-Type": `application/json`,
                "Accept": `application/json`,
                "Authorization": `Bearer ${token}`
            }
          }).then(async (res) => {

            dataPosted++;

            if(dataPosted == count){
              setLoading(false);
              onPostPackagingClose();
              window.location.reload();
            }
  
          }, (err) => {
              console.log("AXIOS ERROR: ", err.message);
          });

        } catch (e) {
          // error = `Processing Photo Failed Upload to ipfs ${e.message}`;
          alert(`Processing Photo Failed Upload to ipfs ${e.message}`);
        }
        // end upload farm to ipfs
      })
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
                      <Th whiteSpace="nowrap" scope="col" > No </Th>
                      <Th whiteSpace="nowrap" scope="col" > SKU </Th>
                      <Th whiteSpace="nowrap" scope="col" > Volume </Th>
                      <Th whiteSpace="nowrap" scope="col" > Date Created </Th>
                      <Th whiteSpace="nowrap" scope="col" > 
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
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row, index) => (
                    <Tr key={index}>
                        <Td whiteSpace="nowrap" scope="col"> {index+1} </Td>
                        <Td whiteSpace="nowrap" scope="col"> {row.get_sku ? row.get_sku.sku : ''} </Td>
                        <Td whiteSpace="nowrap" scope="col"> {row.volume} </Td>
                        <Td whiteSpace="nowrap" scope="col"> {moment(row.created_at).format('DD / MMM / YYYY H:mm:s')} </Td>
                        <Td whiteSpace="nowrap" > 
                          {/* <Center>
                              <Link href={`/exportir/packaging/preview/${encodeURIComponent(row.id)}`} passHref={true}>
                                  <Button variant="outline" size="sm"  colorScheme="yellow">
                                      Preview
                                  </Button>
                              </Link>
                              &nbsp;&nbsp;
                              <Link href={`/exportir/packaging/edit/${encodeURIComponent(row.id)}`} passHref={true}>
                                  <Button variant="outline" size="sm"  colorScheme="blue">
                                      Edit
                                  </Button>
                              </Link>
                          </Center> */}

                          {(() => {
                            // jika data sudah ditulis ke blockchain
                            if( arrBPID.indexOf( row.id ) == -1 ) {
                              return(
                                <Center>
                                  <Link href={`/exportir/packaging/edit/${encodeURIComponent(row.id)}`} passHref={true}>
                                    <Button variant="outline" size="sm"  colorScheme="blue">
                                      Edit
                                    </Button>
                                  </Link>
                                  &nbsp;&nbsp;
                                  {/* <Checkbox 
                                    value={row.id}
                                    data-farm={row}
                                    isChecked={checkedItems[index]}
                                    onChange={(e) => handleCheck(index, e, row.id)}
                                  > Select
                                  </Checkbox> */}
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
                                  <Link href={`/exportir/packaging/preview/${encodeURIComponent(row.id)}`} passHref={true}>
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
            <Flex align="center" justify="space-between">
              <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontSize="sm"
              >
                {data.length} Packaging
              </Text>
              <ButtonGroup variant="outline" size="sm">
                {/* <Button as="a" rel="prev">
                  Previous
                </Button>
                <Button as="a" rel="next">
                  Next
                </Button> */}
                <Button as="a" rel="next" colorScheme="blue" cursor="pointer" onClick={(event) => postDataPackaging(event)} >
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
                    <Th> Packaging </Th>
                    <Th> Packaging ID </Th>
                    <Th> Processed At </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataBlockchain.map((row, index) => (
                    <Tr key={index}>
                      <Td> {index+1} </Td>
                      <Td> {row.status} </Td>
                      <Td> {row.status_remark} </Td>
                      <Td> {row.block_no} </Td>
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
        isOpen={isAddPackagingOpen}
        onClose={onAddPackagingClose}
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
                    {/* <Select onChange={(e) => setSku(e.target.value)} placeholder="Select Sku">
                      {selectSku && selectSku.map((row, index) => (
                        <option key={index} value={row.id} > {row.sku} - {row.sku_name}</option>
                      ))}
                    </Select> */}
                    <Select onChange={(e) => handleSelectChange(e)} placeholder="Select Sku">
                      {selectSku && selectSku.map((row, index) => (
                        <option key={index} value={row.id} > {row.sku} - {row.sku_name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {(() => {
                  if(dataBatch) {
                    return (
                      <>
                        <Box>
                          <FormControl >
                            <FormLabel>Data Batch</FormLabel>
                            <Table my="8" borderWidth="1px" fontSize="sm">
                              <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                                <Tr>
                                  <Th> Batch Number </Th>
                                  <Th> Harvesting Year </Th>
                                  <Th> Species </Th>
                                  <Th> Variety </Th>
                                  <Th> Process </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {dataBatch && dataBatch.map((row, index) => (
                                  <Tr key={index}>
                                    <Td> {row.batch_number} </Td>
                                    <Td> {row.harvesting_year} </Td>
                                    <Td> {row.species} </Td>
                                    <Td> {row.variety} </Td>
                                    <Td> {row.process_name} </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </FormControl>
                        </Box>
                      </>
                    )
                  }
                })()}
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

      <Modal
        isCentered
        isOpen={isPostPackagingOpen}
        onClose={onPostPackagingClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Center>
                <Heading size="lg">Post Packaging Selected</Heading>
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
                            <Button colorScheme="blue" onClick={() => handlePostPackaging()} mr="3">
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
