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
  Table,
  TableContainer,
  Text,
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
import axios from "axios";
import moment from "moment";
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    AsyncCreatableSelect,
    AsyncSelect,
    CreatableSelect,
    Select,
  } from "chakra-react-select";

const processor_preview = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id;

  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [data, setData] = useState([]);
  const [dataFarm, setDataFarm] = useState([]);
  const [dataFarmSelected, setDataFarmSelected] = useState([]);
  
  const [farm, setFarm] = useState([]);
  const [processor, setProcessor] = useState(null);
  const [selectProcessor, setSelectProcessor] = useState(null);

  const token = users.token;

  const getDataProcessor = async () => {

    await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-processor/${id}`,
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
    }).then(
        async (res) => {
          console.log('cek data', res.data);
          setProcessor(res.data.processor);
          setDataFarmSelected(res.data.farmSelected);
        },
        (err) => {
          console.log("AXIOS ERROR: ", err.message);
        }
    );

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

  const submitProcessor = async (e) => {

    if (farm.length > 0 && processor) {
      var postData = {
        processor_name: processor,
        farm: farm,
      };

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URL_API}/updateProcessor/${id}`,
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
            window.open('/processor', "_self");
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

  };

  useEffect(() => {
    if(id) {
        getDataProcessor();
        getDataFarm();
    } else {
        return;
    }
  }, []);

  if(processor) {
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
                <Heading size="lg">Processor Edit</Heading>
              </Box>
              <br></br>
              <hr></hr>
              <br></br>
              <Box>
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
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Processor Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setProcessor(e.target.value)}
                      defaultValue={processor.processor_name}
                      name="processor"
                    />
                  </FormControl>
                </Box>
              </SimpleGrid>
    
                <br></br>
                <hr></hr>
    
                <Flex align="right" justify="space-between">
                  <Box p='4'>
                    <Link href={`/processor`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="grey">
                        Back
                      </Button>
                    </Link>
                  </Box>
                  <Box p='4'>
                    <Button variant="outline" size="sm" onClick={() => submitProcessor()} colorScheme="blue">
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

export default processor_preview;
