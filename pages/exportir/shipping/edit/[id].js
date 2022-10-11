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
import { useRouter } from 'next/router';
import Link from 'next/link';

const Overlay = (props) => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

export default function Shipping() {
  const router = useRouter();
  const { id } = router.query;
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");

  const [serviceList, setServiceList] = useState([{ service: "" }]);
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [selectSku, setSelectSku] = useState(null);
  const [sku, setSku] = useState([]);
  const [volume, setVolume] = useState([]);
  const [dos, setDos] = useState(null);
  const [coo, setCoo] = useState(null);
  const [ico, setIco] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [phitosanitary, setPhytosanitary] = useState(null);
  const [bol, setBol] = useState(null);

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
  };

  const handleServiceAdd = () => {
    setServiceList([...serviceList, { service: "" }]);
  };

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  const getDataShipping = async () => {
    await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-shipping/${id}`,
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
    }).then(
        async (res) => {
          setData(res.data.shipping);
          setDetail(res.data.shipping.get_detail);
          setDos(res.data.shipping.date_shipping);
        },
        (err) => {
          alert("AXIOS ERROR: ", err.message);
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
    // console.log('cek coo', coo);
    // console.log('cek coo name', coo);

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
        console.log("sku", sku.target.value);
        console.log("volume", volume);

        var postData = {
          date_shipping: dos,
          sku: sku.target.value,
          volume: volume,
          coo: docUrlCoo,
          ico: docUrlIco,
          invoice: docUrlInvoice,
          phytosanitary: docUrlPhitosanitary,
          bol: docUrlBol,
        };

        console.log("cek masuk");

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

  const handleSelectSku = async (e) => {
    let v = e;
    await setSku(e);
  };

  const handleVolume = async (e) => {
    let v = e;
    await setVolume(e.target.value);
  };

  useEffect(() => {
    getDataShipping();
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
                <Box >
                    <Heading size="lg">Shipping Preview</Heading>
                </Box>

                <br></br>
                <hr></hr>
                <br></br>

                <Box>
                    <SimpleGrid minChildWidth="50vw" spacing="4">
                        <Box>
                            <FormControl isRequired>
                                <FormLabel>Date of Shipping</FormLabel>
                                <Input
                                    placeholder="Select Date and Time"
                                    size="md"
                                    type="date"
                                    value={dos}
                                    onChange={(e) => setDos(e.target.value)}
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
                            {serviceList.length - 1 === index &&
                                serviceList.length < 4 && (
                                <Button
                                    mt="4"
                                    colorScheme="blue"
                                    mr="3"
                                    title="Add"
                                    onClick={handleServiceAdd}
                                >
                                    <AddIcon w={6} h={6} />
                                </Button>
                                )}
                            </div>
                        </div>
                        ))}
                    </SimpleGrid>
  
                    <br></br>
                    <hr></hr>
  
                    <Flex align="right" justify="space-between">
                        <Box p='4'>
                        <Link href={`/exportir/shipping`} passHref={true}>
                            <Button variant="outline" size="sm" colorScheme="grey">
                            Back
                            </Button>
                        </Link>
                        </Box>
                        <Box p='4'>
                        {/* <Link href={`/exportir/shipping/edit/${encodeURIComponent(data.id)}`} passHref={true}>
                            <Button variant="outline" size="sm" colorScheme="yellow">
                            Edit
                            </Button>
                        </Link> */}
                        </Box>
                    </Flex>
                </Box>
  
            </Box>
        </Box>
    </>
  );
}
