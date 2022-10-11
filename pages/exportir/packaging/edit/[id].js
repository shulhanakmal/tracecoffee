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
import { BsSearch } from "react-icons/bs";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";
import axios from "axios";
import moment from "moment";
import { useRouter } from 'next/router';
import Link from 'next/link';

const batch_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState([]);
  const [selectSku, setSelectSku] = useState(null);
  const [sku, setSku] = useState(null);
  const [volume, setVolume] = useState(null);

  const token = users.token;

  const getDataPackaging = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-packaging/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.packaging);
        setSku(res.data.packaging.sku);
        setVolume(res.data.packaging.volume);
        console.log('cek data', res.data.packaging);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

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

  useEffect(() => {
    if(id) {
        getDataPackaging();
        getDataForm();
    } else {
      return;
    }
  }, []);

  const submitPackaging = async () => {

    if (sku, volume) {
        var postData = {
          sku: sku,
          volume: volume
        };
  
        console.log('cek masuk');
  
        await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_URL_API}/updatePackaging/${id}`,
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
              window.open('/exportir/packaging', "_self");
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
              <Heading size="lg">Packaging Preview</Heading>
            </Box>
            <br></br>
            <hr></hr>
            <br></br>
            <Box>
                <SimpleGrid minChildWidth="50vw" spacing="4">
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>SKU Green Bean</FormLabel>
                            <Select onChange={(e) => setSku(e.target.value)} value={sku} placeholder="Select Sku">
                                {selectSku && selectSku.map((row, index) => (
                                    <option key={index} value={row.id} > {row.sku} - {row.sku_name}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Volume in Kilograms (Kg)</FormLabel>
                            <Select onChange={(e) => setVolume(e.target.value)} value={volume} placeholder="Select Volume">
                                <option value="25 Kg">25 Kg</option>
                                <option value="30 Kg">30 Kg</option>
                                <option value="50 Kg">50 Kg</option>
                                <option value="60 Kg">60 Kg</option>
                            </Select>
                        </FormControl>
                    </Box>
                </SimpleGrid>
  
              <br></br>
              <hr></hr>
  
              <Flex align="right" justify="space-between">
                <Box p='4'>
                  <Link href={`/exportir/packaging`} passHref={true}>
                    <Button variant="outline" size="sm" colorScheme="grey">
                      Back
                    </Button>
                  </Link>
                </Box>
                <Box p='4'>
                    <Button colorScheme="blue" onClick={() => submitPackaging()} mr="3">
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
    return(
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

export default batch_preview