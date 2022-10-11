import React, { useState, useEffect } from "react";
import {
  Box,
  Badge,
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
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
// import { Farm as AbiFarm } from "../../../pages/abi/Farm";
import { create } from "ipfs-http-client";

const columns = [
  {
    Header: "No",
    accessor: "no",
  },
  {
    Header: "Farm Name",
    accessor: "farm_name",
  },
  {
    Header: "Location",
    accessor: "location",
  },
  {
    Header: "Link Maps",
    accessor: "link_maps",
  },
  {
    Header: "Latitude, Longitude",
    accessor: "latitude_longitude",
  },
  {
    Header: "Elevation",
    accessor: "elevation",
  },
  {
    Header: "Date Create",
    accessor: "date",
  },
];

// const data = [
//   {
//     no: "1",
//     farm_name: "Kopi ketjil small lots farm",
//     latitude_longitude: "-6.193125; 106.821810",
//     elevation: "1500 masl",
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

export default function Farm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  const [data, setData] = useState([]);
  
  const [farmName, setFarmName] = useState(null);
  const [location, setLocation] = useState(null);
  const [ipfsLocation, setIfsLocation] = useState(null);
  const [gmapslink, setGmapsLink] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [elevation, setElevation] = useState(null);

  const client = create('https://ipfs.infura.io:5001/api/v0')

  const addDataFarm = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  var date = + cDay + "/" + cMonth + "/" + cYear;

  const submitFarm = async (e) => {

    console.log('cek location', location);

    let error = null;

    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
    const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

    // start upload location to ipfs
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

      const added = await ipfs.add({ path: location.name, content: location });
      let docCid = `${added.cid}`;
      const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}`

      console.log('url', docUrl);
      await setIfsLocation(docUrl);

    } catch (e) {
      error = `Processing Photo Failed Upload to ipfs ${e.message}`;
    }
    // end upload location to ipfs
    // =================================================================================================================================

    if(error) { // jika terjadi error ketika upload file ke ipfs

        alert(error);

    } else {
        
      // start post to blockchain
      // try{
      //   const web3Modal = new Web3Modal();
      //   const connection = await web3Modal.connect();
      //   const provider = new ethers.providers.Web3Provider(connection);
      //   const {chainId} = await provider.getNetwork();
      //   const signer = provider.getSigner();

      //   if(ipfsLocation) {

      //     if(chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {

      //       let contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS_FARM, AbiFarm, signer)
      //       let transaction = await contract.AddData(farmName, ipfsLocation, gmapslink, latitude, longitude, elevation, date)

      //       await transaction.wait();

      //       await alert(`Data has been added and transaction hash is ${transaction.hash}`);

      //       window.location.reload();

      //     } else {
      //       alert("You are not connected to the polygon blockchain network");
      //     }

      //   } else {
      //     alert("file location tidak terbaca");
      //   }

      // } catch(e) {
      //     alert(`Failed, Transaction rejected : ${e.message}`);
      // }
      // end post to blockchain
      // =================================================================================================================================

    }

  }

  const getDataFarm = async () => {

    if(data.length == 0) {

      try{
      
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const {chainId} = await provider.getNetwork();
        const signer = provider.getSigner();
        
        if(chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {
          
          // try {
            
          //   // get data blockchain
          //   let contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS_FARM, AbiFarm, signer)
          //   const transaction = await contract.getAll();
          //   console.log('hi', transaction);

          //   if(transaction.length > 0) {

          //     var arr = [];
          //     await transaction.forEach(async function (value, index) {
          //       console.log('cek value', value);

          //       arr.push(
          //         {
          //           "no" : index+1,
          //           "farm_name" : value[0],
          //           "location" : <Image borderRadius='full' boxSize='100px' src={value[1]} />,
          //           "link_maps" : <Badge target='_blank' to={value[2]} variant='solid' colorScheme='green'> Maps </Badge>,
          //           "latitude_longitude" : `${value[3]} - ${value[4]}`,
          //           "elevation" : `${value[5]} MASL`,
          //           "date" : value[6],
          //         }
          //       );

          //       // const sorted = arr.sort((a, b) => b.tanggal - a.tanggal);
          //       const sorted = arr.slice().sort((a, b) => b.blockchain_date - a.blockchain_date);

          //       setData(sorted);

          //     });

          //   }

          //   // end get data blockchain

          // } catch (e) {
          //   alert(e.message);
          // }

        } else {

          alert("You are not connected to the polygon blockchain network");

        }
      } catch (e) {
        // alert(e.message);
      }

    }

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
                {data.length} farm
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
              <Heading size="lg">Farm Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Farm Name</FormLabel>
                    <Input type="text" onChange={(e) => setFarmName(e.target.value)} name="farmName" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Location Image</FormLabel>
                    <InputGroup>
                      <Input type="file" onChange={(e) => setLocation(e.target.files[0])} name="location" />
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Google Maps Location</FormLabel>
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
    </>
  );
}
