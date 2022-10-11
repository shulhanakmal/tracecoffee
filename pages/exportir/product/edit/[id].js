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

const po_edit = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const [data, setData] = useState(null);
  const [sku, setSku] = useState(null);
  const [skuName, setSkuName] = useState(null);

  const token = users.token;

  const getDataSku = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-sku/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data.sku);
        setSku(res.data.sku.sku);
        setSkuName(res.data.sku.sku_name);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataSku();
    } else {
      return;
    }
  }, []);

  const submitSku = async (e) => {

    if (sku && skuName) {
      var postData = {
        sku: sku,
        sku_name: skuName,
      };

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/updateSku/${id}`,
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
            window.open('/exportir/product', "_self");
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
                <Heading size="lg">Farm Preview</Heading>
            </Box>
            <br></br>
            <hr></hr>
            <br></br>
            <Box>
            <SimpleGrid minChildWidth="50vw" spacing="4">
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU Green Bean</FormLabel>
                    <Input type="text" onChange={(e) => setSku(e.target.value)} defaultValue={sku} />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>SKU GB Name</FormLabel>
                    <Input type="text" onChange={(e) => setSkuName(e.target.value)} defaultValue={skuName} />
                  </FormControl>
                </Box>
            </SimpleGrid>

                <br></br>
                <hr></hr>

                <Flex align="right" justify="space-between">
                <Box p='4'>
                    <Link href={`/farm`} passHref={true}>
                    <Button variant="outline" size="sm" colorScheme="yellow">
                        Back
                    </Button>
                    </Link>
                </Box>
                <Box p='4'>
                    <Button variant="outline" size="sm" onClick={() => submitSku()} colorScheme="blue">
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

export default po_edit