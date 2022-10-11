import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Badge,
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
  Text,
  Textarea,
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
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import { Farm as AbiFarm } from "../../../pages/abi/Farm";
// import { Processor as AbiProcessor } from "../../../pages/abi/Processor";
import { create } from "ipfs-http-client";
import axios from "axios";
import moment from "moment";
import {
  AsyncCreatableSelect,
  AsyncSelect,
  CreatableSelect,
  Select,
} from "chakra-react-select";

const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  {
    Header: "Processor Name",
    accessor: "processor_name",
  },
  // {
  //   Header: "Area of Origin",
  //   accessor: "area",
  // },
  // {
  //   Header: "Naration",
  //   accessor: "narasi",
  // },
  {
    Header: "Date Created",
    accessor: "date",
  },
];

// const data = [
//   {
//     no: "1",
//     processor_name: "Sugiarto",
//     area: "GAYO",
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

export default function Processor() {
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  const [data, setData] = useState([]);
  const [dataFarm, setDataFarm] = useState([]);
  const [dataFarmSelected, setDataFarmSelected] = useState([]);

  const [farmJsonIPFS, setFarmJsonIPFS] = useState(null);
  const [farm, setFarm] = useState([]);
  const [processor, setProcessor] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [naration, setNaration] = useState(null);

  const [hidden, setHidden] = useState(true);

  const client = create("https://ipfs.infura.io:5001/api/v0");
  const token = users.token;

  const addDataProcessor = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = +cDay + "/" + cMonth + "/" + cYear;

  const submitProcessor = async (e) => {

    if (farm.length > 0 && processor) {
      var postData = {
        processor_name: processor,
        farm: farm,
      };

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/insertProcessor`,
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

    // let error = null;

    // const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
    // const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

    // const fileName = "farm";
    // // const json = JSON.stringify(farm, null, 4).replace(/[",\\]]/g, "");
    // const json = farm;
    // const blob = new Blob([json],{type:'application/json'});
    // const href = await URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = href;
    // link.download = fileName + ".json";

    // console.log('cek doc', link);

    // // start upload farm to ipfs
    // try {
    //   const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    //   const ipfs = create(
    //       {
    //           host: 'ipfs.infura.io',
    //           port: 5001,
    //           protocol: 'https',
    //           headers: {
    //               authorization: auth,
    //           },
    //       }
    //   );

    //   const added = await ipfs.add({ path: link.download, content: json });
    //   let docCid = `${added.cid}`;
    //   const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}`

    //   console.log('url', docUrl);
    //   await setFarmJsonIPFS(docUrl);

    // } catch (e) {
    //   error = `Processing Photo Failed Upload to ipfs ${e.message}`;
    // }
    // // end upload farm to ipfs
    // // =================================================================================================================================

    // start post to blockchain
    // try{
    //   const web3Modal = new Web3Modal();
    //   const connection = await web3Modal.connect();
    //   const provider = new ethers.providers.Web3Provider(connection);
    //   const {chainId} = await provider.getNetwork();
    //   const signer = provider.getSigner();

    //   if(farmJsonIPFS) {

    //     if(chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {

    //       let contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS_PROCESSOR, AbiProcessor, signer)
    //       let transaction = await contract.AddData(processor, farmJsonIPFS, origin, naration, date)

    //       await transaction.wait();

    //       await alert(`Data has been added and transaction hash is ${transaction.hash}`);

    //       window.location.reload();

    //     } else {
    //       alert("You are not connected to the polygon blockchain network");
    //     }

    //   } else {
    //     alert("Data farm belum siap untuk disimpan");
    //   }

    // } catch(e) {
    //     alert(`Failed, Transaction rejected : ${e.message}`);
    // }
    // // end post to blockchain
    // // =================================================================================================================================
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
        // setData(res.data.farm);
        var arr = [];
        await res.data.processor.forEach(async function (value, index) {
          console.log("cek value", value);

          arr.push({
            no: index + 1,
            processor_name: value.processor_name,
            date: moment(value.created_at).format("DD / MMM / YYYY H:mm:s"),
          });

          setData(arr);
        });
      },
      (err) => {
        console.log("AXIOS ERROR: ", err.message);
      }
    );

    // if(data.length == 0) {

    //   const web3Modal = new Web3Modal();
    //   const connection = await web3Modal.connect();
    //   const provider = new ethers.providers.Web3Provider(connection);
    //   const {chainId} = await provider.getNetwork();
    //   const signer = provider.getSigner();

    //   if(chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {

    //     try {

    //       // get data blockchain
    //       let contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS_PROCESSOR, AbiProcessor, signer)
    //       const transaction = await contract.getAll();

    //       if(transaction.length > 0) {

    //         var arr = [];
    //         await transaction.forEach(async function (value, index) {

    //           arr.push(
    //             {
    //               "no" : index+1,
    //               "processor_name" : value[0],
    //               "area" : value[2],
    //               "narasi" : value[3],
    //               "date" : value[4],
    //             }
    //           );

    //           // const sorted = arr.sort((a, b) => b.tanggal - a.tanggal);
    //           const sorted = arr.slice().sort((a, b) => b.blockchain_date - a.blockchain_date);

    //           setData(sorted);

    //         });

    //       }

    //       // end get data blockchain

    //     } catch (e) {
    //       alert(e.message);
    //     }

    //   } else {

    //     alert("You are not connected to the polygon blockchain network");

    //   }

    // }
  };

  const getDataFarm = async () => {
    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-farm`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        var arr = [];
        await res.data.farm.forEach(async function (value, index) {
          arr.push({
            id: value.id,
            farm_name: value.farm_location,
            // "link_maps" : <Badge variant='solid' colorScheme='green'><a target='_blank' href={value.link_maps}> Maps</a> </Badge>,
            link_maps: value.link_maps,
            latitude: value.latitude,
            longitude: value.longitude,
            elevation: value.elevation,
            date: moment(value.created_at).format("DD / MMM / YYYY H:mm:s"),
          });
        });

        setDataFarm(arr);
      },
      (err) => {
        console.log("AXIOS ERROR: ", err.message);
      }
    );
  };

  const getFarmDetail = async (e) => {
    let v = e;

    await setFarm(e);

    await console.log("cek farm", farm);
  };

  useEffect(() => {
    getDataProcessor();
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
              <Heading size="lg">Processor Data</Heading>
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
                    onClick={(event) => addDataProcessor(event)}
                  >
                    Add Processor Data
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
                {data.length} processor
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
              <Heading size="lg">Processor Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Farm</FormLabel>
                    <Select
                      isMulti
                      colorScheme="purple"
                      onChange={(e) => getFarmDetail(e)}
                      options={
                        dataFarm && dataFarm.map(function(rows, i) {
                          return (
                            {
                              label: `${rows.farm_name} - ${rows.elevation} MASL`,
                              value: `${rows.id}`,
                            }
                          );
                        })
                      }
                    />
                  </FormControl>
                </Box>
                {/* <Box hidden={hidden}>
                  <Text>Farm Name: {dataFarmSelected ? dataFarmSelected.farmname : '-'}</Text>
                  <Text>Location Image:</Text>
                  <Box mt="4" mb="4">
                    <Image
                      src={dataFarmSelected.loc ? dataFarmSelected.loc : "https://media.istockphoto.com/vectors/sample-sign-sample-square-speech-bubble-sample-vector-id1161352480?k=20&m=1161352480&s=612x612&w=0&h=uVaVErtcluXjUNbOuvGF2_sSib9dZejwh4w8CwJPc48="}
                      maxW="400px"
                    />
                  </Box>
                  <Text>Google Maps Link: <a href={dataFarmSelected.maps ? dataFarmSelected.maps : '#'} target="_blank">{dataFarmSelected.maps ? dataFarmSelected.maps : '-'}</a></Text>
                  <Text>Latitude, Longitude: {dataFarmSelected.lat ? dataFarmSelected.lat : '-'} - {dataFarmSelected.long ? dataFarmSelected.long : '-'}</Text>
                  <Text>Elevation: {dataFarmSelected.elevation ? dataFarmSelected.elevation : '-'} masl</Text>
                </Box> */}
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Processor Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setProcessor(e.target.value)}
                      name="processor"
                    />
                  </FormControl>
                </Box>
                {/* <Box>
                  <FormControl isRequired>
                    <FormLabel>Area of Origin</FormLabel>
                    <Input type="text" onChange={(e) => setOrigin(e.target.value)} name="origin" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Narration</FormLabel>
                    <Textarea size="sm" onChange={(e) => setNaration(e.target.value)} />
                  </FormControl>
                </Box> */}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => submitProcessor()}
                mr="3"
              >
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
