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
  SimpleGrid,
  Stack,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
    Select as SelectM,
} from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import axios from "axios";
import moment from "moment";
import { useRouter } from 'next/router';
import Link from 'next/link';

const batch_edit = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const [data, setData] = useState(null);
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

  const getDataBatch = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-batch/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.batch);
        setSku(res.data.batch.sku_id);
        setPo(res.data.batch.po_id);
        setHarvest(res.data.batch.harvesting_year);
        setBatch(res.data.batch.batch_number);
        setSpecies(res.data.batch.species);
        setVariety(res.data.batch.variety);
        setProcessName(res.data.batch.process_name);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

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

    if (po,sku.length > 0,harvest,batch,species,variety,processName) {
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
        url: `${process.env.NEXT_PUBLIC_URL_API}/updateBatch/${id}`,
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
            window.open('/exportir/batch', "_self");
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
    if(id) {
        getDataBatch();
        getDataForm();
    } else {
        return;
    }
  }, []);

  if(data) {

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
                <Heading size="lg">Edit Batch</Heading>
            </Box>
            <br></br>
            <hr></hr>
            <br></br>
            <Box>

                <SimpleGrid minChildWidth="50vw" spacing="4">
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>PO Number</FormLabel>
                            <Select 
                                placeholder="Select PO Number"
                                onChange={(e) => setPo(e.target.value)}
                                value={data.po_id}
                            >
                            <option value={data.po_id} > {data.get_po ? data.get_po.po_number : ''}</option>
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
                                value={data.sku_id}
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
                            defaultValue={harvest ? harvest : ''}
                            onChange={(e) => setHarvest(e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Batch Number Green Bean</FormLabel>
                            <Input type="text" defaultValue={batch ? batch : ''} onChange={(e) => setBatch(e.target.value)} name="tanggalTransaksi" />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Spesies</FormLabel>
                            <Select onChange={(e) => setSpecies(e.target.value)} defaultValue={species} placeholder="Select Spesies">
                                <option value="Arabica">Arabica</option>
                                <option value="Robusta">Robusta</option>
                                <option value="Liberica">Liberica</option>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Variety</FormLabel>
                            <Input type="text" defaultValue={variety ? variety : ''} onChange={(e) => setVariety(e.target.value)} name="tanggalTransaksi" />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Process Name</FormLabel>
                            <Input type="text" defaultValue={processName ? processName : ''} onChange={(e) => setProcessName(e.target.value)} name="tanggalTransaksi" />
                        </FormControl>
                    </Box>
                </SimpleGrid>

                <br></br>
                <hr></hr>

                <Flex align="right" justify="space-between">
                <Box p='4'>
                    <Link href={`/exportir/batch`} passHref={true}>
                    <Button variant="outline" size="sm" colorScheme="yellow">
                        Back
                    </Button>
                    </Link>
                </Box>
                <Box p='4'>
                    <Button variant="outline" size="sm" onClick={() => submitBatch()} colorScheme="blue">
                        Submit
                    </Button>
                </Box>
                </Flex>

            </Box>
            </Box>
        </Box>
        </>
    );

  } else {
    return (
        <>
            <Center>
                <br></br>
                <br></br>
                Please Wait...
            </Center>
        </>
    )
  }

}

export default batch_edit
