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
  const [processor, setProcessor] = useState(null);
  const [selectProcessor, setSelectProcessor] = useState(null);
  const [po, setPo] = useState(null);

  const token = users.token;

  const getDataPo = async () => {

    await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-po/${id}`,
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
      }).then(
        async (res) => {
            setData(res.data.po);
            setSelectProcessor(res.data.po.processor);
        },
        (err) => {
          alert("AXIOS ERROR: ", err.message);
        }
    );

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
        var arr = [];
        await res.data.processor.forEach(async function (value, index) {

          arr.push({
            processor_id: value.id,
            processor_name: value.processor_name
          });

          setProcessor(arr);
        });
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataPo();
        getDataProcessor();
    } else {
        return;
    }
  }, []);

  const submitPo = async () => {

    console.log('cek data po id', id);
    console.log('cek data po number', po);
    console.log('cek data processor', selectProcessor);

    if(id && po && selectProcessor) {
        var postData = {
            po_number: po,
            processor: selectProcessor
        };

        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_URL_API}/updatePo/${id}`,
            data: postData,
            headers: {
              "Content-Type": `application/json`,
              "Accept": `application/json`,
              "Authorization": `Bearer ${token}`
            },
          }).then(async (res) => {
            if(res.data.success) {
              await alert('Data berhasil disimpan');
              window.open('/exportir/po', "_self");
            } else {
              alert(res.data.message);
            }
          }, (err) => {
            console.log("AXIOS ERROR: ", err);
            alert(err.message);
          });
    } else {
        alert('Please fill in completely');
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
                    <FormLabel>PO Number</FormLabel>
                    <Input type="text" onChange={(e) => setPo(e.target.value)} defaultValue={data.po_number} />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Processor</FormLabel>
                    <Select 
                      placeholder="Select Processor"
                      onChange={(e) => setSelectProcessor(e.target.value)}
                      value={data.processor}
                    >
                      {processor && processor.map((row, index) => (
                        <option key={index} value={row.processor_id} > {row.processor_name}</option>
                      ))}
                    </Select>
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
                    <Button variant="outline" size="sm" onClick={() => submitPo()} colorScheme="blue">
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
