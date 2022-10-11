import React, { useState, useEffect } from "react";
import {
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
  Spacer,
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
import { create } from "ipfs-http-client";
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import QRcode from "qrcode.react";

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
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddBatchOpen, onOpen: onAddBatchOpen, onClose: onAddBatchClose } = useDisclosure();
  const { isOpen: isQrBatchOpen, onOpen: onQrBatchOpen, onClose: onQrBatchClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");

  const [qr, setQr] = useState(null);
  const [dataQr, setDataQr] = useState(null);
  const [data, setData] = useState([]);
  const [selectPo, setSelectPo] = useState(null);
  const [selectSku, setSelectSku] = useState(null);
  const [po, setPo] = useState(null);
  const [sku, setSku] = useState(null);
  const [harvest, setHarvest] = useState(null);
  const [batch, setBatch] = useState(null);
  const [species, setSpecies] = useState(null);
  const [variety, setVariety] = useState(null);
  const [processName, setProcessName] = useState(null);
  const [hidden, setHidden] = useState(true);

  const client = create("https://ipfs.infura.io:5001/api/v0");
  const token = users.token;
  const userId = users.user.id;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onAddBatchOpen();
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

      setData(res.data.batch);

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
      setSelectSku(res.data.data.sku);
    }, (err) => {
      console.log("AXIOS ERROR: ", err.message);
    });

  }

  const submitBatch = async () => {

    if (po,sku,harvest,batch,species,variety,processName) {
      var postData = {
        po: po,
        sku: sku,
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

            await generateQR(res.data.data);
            
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

  const generateQR = async (data) => {

    if(qr) {
      let canvas = document.getElementById("myqr");
      let imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      await QRtoIPFS(data, imageBlob);
    } else {
      alert('qr belum terupdate');
    }

  }

  const QRtoIPFS = async (data, imageQr) => {

    // upload ke ipfs
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
    const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

    const fileName = data.batch_number+".png";

    const ipfsJson = null;
    // start upload farm to ipfs
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

      const added = await ipfs.add({ path: fileName, content: imageQr });
      let docCid = `${added.cid}`;
      const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}`
      ipfsJson = docUrl;

      console.log('url', docUrl);
      // await setProcessorJsonIPFS(docUrl);

      // update processor to save content id ipfs to processor table
      let postData = {
        qr: docUrl
      };
      await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_API}/insert-ipfs-batch/${data.id}`,
        data: postData,
        headers: {
            "Content-Type": `application/json`,
            "Accept": `application/json`,
            "Authorization": `Bearer ${token}`
        }
      }).then(async (res) => {

        await alert("Data berhasil disimpan");
        window.location.reload();

      }, (err) => {
          console.log("AXIOS ERROR: ", err.message);
      });

    } catch (e) {
      alert(`Qr Batch Failed Upload to ipfs ${e.message}`);
    }
    // end upload farm to ipfs

  }

  const handleBatchNumberChange = async (e) => {

    setBatch(e.target.value);

    const linkQRCode =
      process.env.NEXT_PUBLIC_URL_NEXT +
      "/QR-Batch/" +
      e.target.value;
    await setQr(linkQRCode);

  }

  // Using fetch
  const downloadImage = async (imageSrc) => {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'Batch.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleModal = (data) => {
    setOverlay(<Overlay />);
    setDataQr(data);

    onQrBatchOpen();
  };

  const handleGenerateQr = async (data) => {

    await downloadImage(data.qr);
    await onQrBatchClose();

  }

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
                        <Th whiteSpace="nowrap" scope="col" > No.</Th>
                        <Th whiteSpace="nowrap" scope="col" > SKU Green Bean</Th>
                        <Th whiteSpace="nowrap" scope="col" > Harvesting Year</Th>
                        <Th whiteSpace="nowrap" scope="col" > Po Number</Th>
                        <Th whiteSpace="nowrap" scope="col" > Batch Number</Th>
                        <Th whiteSpace="nowrap" scope="col" > Date Created</Th>
                        <Th whiteSpace="nowrap" scope="col" > Action</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row, index) => (
                    <Tr key={index}>
                        <Td whiteSpace="nowrap" > {index+1} </Td>
                        <Td whiteSpace="nowrap" > {row.get_sku ? row.get_sku.sku : ''} </Td>
                        <Td whiteSpace="nowrap" > {row.harvesting_year} </Td>
                        <Td whiteSpace="nowrap" > {row.get_po ? row.get_po.po_number : ''} </Td>
                        <Td whiteSpace="nowrap" > {row.batch_number} </Td>
                        <Td whiteSpace="nowrap" > {moment(row.created_at).format('DD / MMM / YYYY H:mm:s')} </Td>
                        <Td whiteSpace="nowrap" > 
                            <Center>
                                <Link href={`/exportir/batch/preview/${encodeURIComponent(row.id)}`} passHref={true}>
                                    <Button variant="outline" size="sm"  colorScheme="yellow">
                                        Preview
                                    </Button>
                                </Link>
                                &nbsp;&nbsp;
                                <Link href={`/exportir/batch/edit/${encodeURIComponent(row.id)}`} passHref={true}>
                                    <Button variant="outline" size="sm"  colorScheme="blue">
                                        Edit
                                    </Button>
                                </Link>
                                &nbsp;&nbsp;
                                {/* <a href={row.qr} download> */}
                                {/* <Button variant="outline" size="sm" onClick={() => downloadImage(row.qr)} colorScheme="green">
                                  Generate Qr
                                </Button> */}
                                <Button variant="outline" size="sm" onClick={() => handleModal(row)} colorScheme="green">
                                  QRCode
                                </Button>
                                {/* </a> */}
                            </Center>
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
        isOpen={isQrBatchOpen}
        onClose={onQrBatchClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Center>
                <Heading size="lg">QRCODE - BATCH</Heading>
              </Center>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <Center>
                    <HStack spacing={8} alignItems={"center"}>
                      <Box>
                        <Center>
                          <HStack spacing={8} alignItems={"center"}>
                            {/* <Spinner
                              thickness='4px'
                              speed='0.65s'
                              emptyColor='gray.200'
                              color='blue.500'
                              size='xl'
                            /> */}
                          </HStack>
                        </Center>
                      </Box>
                      <Box>
                        <Center>
                          <HStack spacing={8} alignItems={"center"}>
                            {/* <Text>Please Wait...</Text> */}
                            </HStack>
                        </Center>
                      </Box>
                    </HStack>
                  </Center>
                </Box>
                <Box>
                  <FormControl >
                    <Text>You can generate QRCode to download the QR or View data QRCode </Text>
                  </FormControl>
                </Box>
              </SimpleGrid>
              <br></br>
              <hr></hr>
              <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                <Box>
                  <Flex>
                    <Box p='4'>
                      {/*  */}
                    </Box>
                    <Spacer />
                    <Box p='4'>
                      {/* <Link href={`/QR-Batch/${dataQr.batch_number}`} > */}
                      <a target="_blank" href={`/QR-Batch/${dataQr ? dataQr.batch_number : ''}`}>
                        <Button colorScheme="yellow" mr="3">
                          View Data QR
                        </Button>
                      </a>
                      {/* </Link> */}
                    </Box>
                    <Box p='4'>
                      <Button colorScheme="blue" onClick={() => handleGenerateQr(dataQr)} mr="3">
                        Generate QR
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              </SimpleGrid>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        isOpen={isAddBatchOpen}
        onClose={() => {
          setHidden(true);
          onAddBatchClose();
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
                        <option key={index} value={row.id} > {row.po_number}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU Green Bean</FormLabel>
                    <Select 
                      placeholder="Select SKU"
                      onChange={(e) => setSku(e.target.value)}
                    >
                      {selectSku && selectSku.map((row, index) => (
                        <option key={index} value={row.id} > {`${row.sku} - ${row.sku_name}`}</option>
                      ))}
                    </Select>
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
                    <Input type="text" onChange={(e) => handleBatchNumberChange(e)} name="tanggalTransaksi" />
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

      <div hidden >
        {qr ? (
          <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
        ) : (
          <p>No QR code preview</p>
        )}
      </div>

    </>
  );
}
