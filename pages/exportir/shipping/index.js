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
  InputGroup,
  InputLeftElement,
  Link,
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
  Badge,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { create } from "ipfs-http-client";
import axios from "axios";
import moment from "moment";
import QRcode from "qrcode.react";

const Overlay = (props) => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

export default function Shipping() {
  let users = JSON.parse(localStorage.getItem("users"));
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const { isOpen: isAddShippingOpen, onOpen: onAddShippingOpen, onClose: onAddShippingClose } = useDisclosure();
  const { isOpen: isQrShippingOpen, onOpen: onQrShippingOpen, onClose: onQrShippingClose } = useDisclosure();
  const [overlay, setOverlay] = useState("");

  const [qr, setQr] = useState(null);
  const [dataQr, setDataQr] = useState(null);
  const [serviceList, setServiceList] = useState([{ service: "" }]);
  const [data, setData] = useState([]);
  const [selectSku, setSelectSku] = useState(null);
  const [sku, setSku] = useState([]);
  const [volumeTemp, setVolumeTemp] = useState([]);
  const [volume, setVolume] = useState([]);
  const [dos, setDos] = useState(null);
  const [coo, setCoo] = useState(null);
  const [ico, setIco] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [phitosanitary, setPhytosanitary] = useState(null);
  const [bol, setBol] = useState(null);
  const [handleAdd, setHandleAdd] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [cooIpfs, setCooIpfs] = useState(null);
  const [icoIpfs, setIcoIpfs] = useState(null);
  const [invoiceIpfs, setInvoiceIpfs] = useState(null);
  const [phitosanitaryIpfs, setPhytosanitaryIpfs] = useState(null);
  const [bolIpfs, setBolIpfs] = useState(null);

  const client = create("https://ipfs.infura.io:5001/api/v0");
  const token = users.token;

  const handleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];
    list[index][name] = value;
    setServiceList(list);
  };

  const handleServiceRemove = (index) => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);

    volume.splice(volume.indexOf(index), 1);
  };

  const handleServiceAdd = () => {
    setServiceList([...serviceList, { service: "" }]);

    // get volume input
    if(volumeTemp.length > 0){
      volume.push(volumeTemp);
    }

    setHandleAdd(!handleAdd);
  };

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onAddShippingOpen();
  };

  const handleModal = (data) => {
    setOverlay(<Overlay />);
    setDataQr(data);

    const linkQRCode = process.env.NEXT_PUBLIC_URL_NEXT + "/QR-Shipping/" + data.id;
    setQr(linkQRCode);

    onQrShippingOpen();
  };

  const getDataShipping = async () => {
    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-shipping`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        console.log("cek array", res);

        var arr = [];
        setData(res.data.data);
      },
      (err) => {
        console.log("AXIOS ERROR: ", err.message);
      }
    );
  };

  const getDataForm = async () => {
    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-shipping-form`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setSelectSku(res.data.data);
      },
      (err) => {
        console.log("AXIOS ERROR: ", err.message);
      }
    );
  };

  const submitShipping = async () => {

    // get last volume input
    await volume.push(volumeTemp);

    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID; // <---------- your Infura Project ID (mestinya ditaro di .ENV)
    const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET; // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))
    const error = false;

    // start upload coo to ipfs
    var docUrlCoo = "";
    try {
      const auth =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const addedCoo = await ipfs.add({ path: coo.name, content: coo });
      docUrlCoo = `https://msa-file.infura-ipfs.io/ipfs/${addedCoo.cid}`;
      setCooIpfs(docUrlCoo);
      console.log("coo", docUrlCoo);
    } catch (e) {
      error = `Country Of Origin Failed Upload to ipfs ${e.message}`;
    }
    // end upload coo to ipfs
    // =================================================================================================================================

    // start upload ico to ipfs
    var docUrlIco = "";
    try {
      const auth =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const addedIco = await ipfs.add({ path: ico.name, content: ico });
      docUrlIco = `https://msa-file.infura-ipfs.io/ipfs/${addedIco.cid}`;
      setIcoIpfs(docUrlIco);
      console.log("ico", docUrlIco);
    } catch (e) {
      console.log("ico konten", ico);
      console.log("ico name", ico.name);
      error = `Certificate Of Origin Failed Upload to ipfs ${e.message}`;
    }
    // end upload ico to ipfs
    // =================================================================================================================================

    // start upload invoice to ipfs
    var docUrlInvoice = "";
    try {
      const auth =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const addedInvoice = await ipfs.add({
        path: invoice.name,
        content: invoice,
      });
      docUrlInvoice = `https://msa-file.infura-ipfs.io/ipfs/${addedInvoice.cid}`;
      setInvoiceIpfs(docUrlInvoice);
      console.log("doc", docUrlInvoice);
    } catch (e) {
      error = `Invoice Failed Upload to ipfs ${e.message}`;
    }
    // end upload invoice to ipfs
    // =================================================================================================================================

   
    // start upload Phytosanitary to ipfs
    var docUrlPhitosanitary = "";
    try {
      const auth =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const addedPhitosanitary = await ipfs.add({
        path: phitosanitary.name,
        content: phitosanitary,
      });
      docUrlPhitosanitary = `https://msa-file.infura-ipfs.io/ipfs/${addedPhitosanitary.cid}`;
      setPhytosanitaryIpfs(docUrlPhitosanitary);
      console.log("phy", docUrlPhitosanitary);
    } catch (e) {
      error = `Phytosanitary Certificate Failed Upload to ipfs ${e.message}`;
    }
    // end upload Phytosanitary to ipfs
    // =================================================================================================================================

    // start upload Bill Of Lading to ipfs
    var docUrlBol = "";
    try {
      const auth =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const addedBol = await ipfs.add({ path: bol.name, content: bol });
      docUrlBol = `https://msa-file.infura-ipfs.io/ipfs/${addedBol.cid}`;
      setBolIpfs(docUrlBol);
      console.log("bol", docUrlBol);
    } catch (e) {
      error = `Bill Of Lading Photo Failed Upload to ipfs ${e.message}`;
    }
    // end upload Bill Of Lading to ipfs
    // =================================================================================================================================

    if (error) {
      alert(error);
    } else {
      if (
        (dos,
        sku,
        volume,
        docUrlCoo,
        docUrlIco,
        docUrlInvoice,
        docUrlPhitosanitary,
        docUrlBol)
      ) {

        var postData = {
          date_shipping: dos,
          sku: sku,
          volume: volume,
          coo: docUrlCoo,
          ico: docUrlIco,
          invoice: docUrlInvoice,
          phytosanitary: docUrlPhitosanitary,
          bol: docUrlBol,
        };

        await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_URL_API}/insertShipping`,
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

              // const linkQRCode = process.env.NEXT_PUBLIC_URL_NEXT + "/QR-Batch/" + res.data.shipping.id;
              // console.log('cek link qr', linkQRCode);
              // setQr(linkQRCode);
              // generateQR(res.data.shipping);

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
        console.log("dos", dos);
        console.log("sku", sku);
        console.log("volume", volume);
        console.log("cooIpfs", cooIpfs);
        console.log("icoIpfs", icoIpfs);
        console.log("invoiceIpfs", invoiceIpfs);
        console.log("phitosanitaryIpfs", phitosanitaryIpfs);
        console.log("bolIpfs", bolIpfs);
        alert("Harap isi data dengan lengkap");
      }
    }
  };

  const generateQR = async (data) => {

    if(qr){
      let canvas = document.getElementById("myqr");
      let imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      await QRtoIPFS(data, imageBlob);
    } else {
      alert('qr belum ready');      
    }

  }

  const QRtoIPFS = async (data, imageQr) => {

    console.log('masuk kesini');

    // upload ke ipfs
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
    const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

    const fileName = data.id+".png";

    const ipfsFile = null;
    // start upload qr to ipfs
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
      ipfsFile = docUrl;

      console.log('url', docUrl);

      // update shipping to save content id ipfs to shipping table
      let postData = {
        qr: docUrl
      };
      await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_API}/insert-ipfs-shipping/${data.id}`,
        data: postData,
        headers: {
            "Content-Type": `application/json`,
            "Accept": `application/json`,
            "Authorization": `Bearer ${token}`
        }
      }).then(async (res) => {

        const image = await fetch(res.data.data.qr)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)
    
        const link = document.createElement('a')
        link.href = imageURL
        link.download = 'Shipping.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        onQrShippingClose();
        // window.location.reload();

      }, (err) => {
          console.log("AXIOS ERROR: ", err.message);
      });

    } catch (e) {
      alert(`Qr Batch Failed Upload to ipfs ${e.message}`);
    }
    // end upload qr to ipfs

  }

  const handleSelectSku = async (e) => {

    let v = e;
    // await setSku(e);
    sku.push(e.target.value);

  };

  const handleVolume = async (e) => {

    let v = e.target.value;
    // await setVolume(e.target.value);
    await setVolumeTemp(e.target.value);

    if(e.target.value.length > 0){
      setHandleAdd(true);
    }

  };

  const downloadImage = async (imageSrc) => {

    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'Shipping.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  }

  const handleGenerateQr = async (data) => {

    if(data.qr) { // jika qrcode sudah digenerate dan disimpan ke ipfs

      const image = await fetch(data.qr)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
  
      const link = document.createElement('a')
      link.href = imageURL
      link.download = 'Shipping.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      onQrShippingClose();

    } else {

      await generateQR(data);

    }

  }

  // const handleDateChange = async (e) => {

  //   setDos(e.target.value);
  //   let x = e.target.value.replaceAll("/", "");

  //   const linkQRCode =
  //     process.env.NEXT_PUBLIC_URL_NEXT +
  //     "/QR-Batch/" +
  //     x;
  //   await setQr(linkQRCode);

  // }

  // const addData = (event) => {
  //   event.target.value = null;
  //   setOverlay(<Overlay />);
  //   onOpen();
  // };

  useEffect(() => {
    getDataShipping();
    getDataForm();
  }, [qr]);

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
              <Heading size="lg">Shipping Data</Heading>
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
                    Add Shipping Data
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
                    <Th> No </Th>
                    {/* <Th> Country of Origin </Th>
                    <Th> ICO Certificate of Origin </Th>
                    <Th> Invoice and Packing List </Th>
                    <Th> Phytosanitary Certificate </Th>
                    <Th> Bill of Lading </Th> */}
                    <Th> Date of Shipping </Th>
                    <Th> Action </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row, index) => (
                    <Tr key={index}>
                        <Td> {index+1} </Td>
                        {/* <Td> 
                            <a target="_blank" cursor="pointer" href={row.country_origin}> <Badge variant="solid" colorScheme="green"> View </Badge> </a>
                        </Td>
                        <Td> 
                            <a target="_blank" cursor="pointer" href={row.ico}> <Badge variant="solid" colorScheme="green"> View </Badge> </a>
                        </Td>
                        <Td> 
                            <a target="_blank" cursor="pointer" href={row.invoice}> <Badge variant="solid" colorScheme="green"> View </Badge> </a>
                        </Td>
                        <Td> 
                            <a target="_blank" cursor="pointer" href={row.phytosanitary}> <Badge variant="solid" colorScheme="green"> View </Badge> </a>
                        </Td>
                        <Td> 
                            <a target="_blank" cursor="pointer" href={row.bill_of_lading}> <Badge variant="solid" colorScheme="green"> View </Badge> </a>
                        </Td> */}
                        <Td> 
                            {moment(row.date_shipping).format("DD / MMM / YYYY")}
                        </Td>
                        <Td> 
                          {/* <Center> */}
                            <Link href={`/exportir/shipping/preview/${encodeURIComponent(row.id)}`} >
                              <Button variant="outline" size="sm"  colorScheme="yellow">
                                Preview
                              </Button>
                            </Link>
                            &nbsp;&nbsp;
                            <Link href={`/exportir/shipping/edit/${encodeURIComponent(row.id)}`} >
                              <Button variant="outline" size="sm"  colorScheme="blue">
                                Edit
                              </Button>
                            </Link>
                            &nbsp;&nbsp;
                            <Button variant="outline" size="sm" onClick={() => handleModal(row)} colorScheme="green">
                              QRCode
                            </Button>
                          {/* </Center> */}
                        </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <br></br>
            <Flex align="center" justify="space-between">
              <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontSize="sm"
              >
                {data.length} Shipping
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
        isOpen={isQrShippingOpen}
        onClose={onQrShippingClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Center>
                <Heading size="lg">QRCODE - SHIPPING</Heading>
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
                      {/* <Link href={`/exportir/shipping/preview/${encodeURIComponent(dataQr ? dataQr.id : '')}`} > */}
                      <a target="_blank" href={`/QR-Shipping/${dataQr ? dataQr.id : ''}`}>
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
        isOpen={isAddShippingOpen}
        onClose={onAddShippingClose}
        size="4xl"
        scrollBehavior={scrollBehavior}
      >
        {overlay}
        <ModalContent p="4">
          <>
            <ModalHeader>
              <Text size="xs">Add</Text>
              <Heading size="lg">Shipping Data</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="2">
              <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Date of Shipping</FormLabel>
                    <Input
                      placeholder="Select Date and Time"
                      size="md"
                      type="date"
                      onChange={(e) => setDos(e.target.value)}
                      // onChange={(e) => handleDateChange(e)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Country of Origin</FormLabel>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={(e) => setCoo(e.target.files[0])}
                      />
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>ICO Certificate of Origin</FormLabel>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={(e) => setIco(e.target.files[0])}
                      />
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Invoice and Packing List</FormLabel>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={(e) => setInvoice(e.target.files[0])}
                      />
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Phytosanitary Certificate</FormLabel>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={(e) => setPhytosanitary(e.target.files[0])}
                      />
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Bill of Lading</FormLabel>
                    <InputGroup>
                      <Input
                        type="file"
                        onChange={(e) => setBol(e.target.files[0])}
                      />
                    </InputGroup>
                  </FormControl>
                </Box>

                {serviceList.map((singleService, index) => (
                  <div key={index} className="services">
                    <div className="first-division">
                      <Flex>
                        <Box w="250px">
                          <FormControl isRequired>
                            <FormLabel>SKU Green Bean</FormLabel>
                            <Select
                              onChange={(e) => handleSelectSku(e)}
                              placeholder="Select"
                            >
                              {selectSku &&
                                selectSku.map((row, index) => (
                                  <option key={index} value={row.sku}>
                                    {" "}
                                    {row.sku} - {row.sku_name}{" "}
                                  </option>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        &nbsp;&nbsp;
                        <Box w="250px">
                          <FormControl isRequired>
                            <FormLabel>Volume Packaging (Kg)</FormLabel>
                            <Input
                              onChange={(e) => handleVolume(e)}
                              type="text"
                            />
                          </FormControl>
                        </Box>
                        &nbsp;&nbsp;
                        <div className="second-division">
                          {serviceList.length !== 1 && (
                            <Box w="250px">
                              <FormControl>
                                <FormLabel> Action </FormLabel>
                                <Button
                                  colorScheme="red"
                                  mr="3"
                                  title="Remove"
                                  onClick={() => handleServiceRemove(index)}
                                >
                                  <DeleteIcon w={6} h={6} />
                                </Button>
                              </FormControl>
                            </Box>
                          )}
                        </div>
                      </Flex>
                      {(() => {
                        if(handleAdd) {
                          if(serviceList.length - 1 === index && serviceList.length < 4) {
                            return(
                              <Button
                                mt="4"
                                colorScheme="blue"
                                mr="3"
                                title="Add"
                                onClick={handleServiceAdd}
                              >
                                <AddIcon w={6} h={6} />
                              </Button>
                            )
                          }
                        } else {
                          if(serviceList.length - 1 === index && serviceList.length < 4) {
                            return(
                              <Button
                                disabled
                                mt="4"
                                colorScheme="blue"
                                mr="3"
                                title="Please fill the volume first"
                                onClick={handleServiceAdd}
                              >
                                <AddIcon w={6} h={6} />
                              </Button>
                            )
                          }
                        }
                      })()}
                    </div>
                  </div>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => submitShipping()}
                mr="3"
              >
                Add
              </Button>
              {/* <Button colorScheme="red">Reset</Button> */}
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <div style={{ visibility: "hidden" }} >
        {qr ? (
          <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
        ) : (
          <p>No QR code preview</p>
        )}
        Please Wait...
      </div>

      {/* <div hidden > */}
      {/* <div >
        {qr ? (
          <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
        ) : (
          <p>No QR code preview</p>
        )}
      </div> */}

    </>
  );

}
