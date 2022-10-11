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

const Overlay = (props) => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

const farm_edit = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  const [data, setData] = useState(null);
  
  const [farmName, setFarmName] = useState(null);
  const [location, setLocation] = useState(null);
  const [ipfsLocation, setIfsLocation] = useState(null);
  const [gmapslink, setGmapsLink] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [elevation, setElevation] = useState(null);

  const token = users.token;

  const addData = (event) => {
    event.target.value = null;
    setOverlay(<Overlay />);
    onOpen();
  };

  const getDataFarm = async () => {

    await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-preview/${id}`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
    }).then(
      async (res) => {
        setData(res.data['farm']);
        setFarmName(res.data['farm'].farm_location);
        setGmapsLink(res.data['farm'].link_maps);
        setLatitude(res.data['farm'].latitude);
        setLongitude(res.data['farm'].longitude);
        setElevation(res.data['farm'].elevation);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
      getDataFarm();
    } else {
      return;
    }
  }, []);

  const submitFarm = async () => {

    console.log('cek data farm id', id);
    console.log('cek data farm', farmName);
    console.log('cek data maps', gmapslink);
    console.log('cek data latitude', latitude);
    console.log('cek data longitude', longitude);
    console.log('cek data elevation', elevation);

    if(id && farmName && gmapslink && latitude && longitude && elevation) {
        var postData = {
            farm_location: farmName,
            link_maps: gmapslink,
            latitude: latitude,
            longitude: longitude,
            elevation: elevation
        };

        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_URL_API}/updateFarm/${id}`,
            data: postData,
            headers: {
              "Content-Type": `application/json`,
              "Accept": `application/json`,
              "Authorization": `Bearer ${token}`
            },
          }).then(async (res) => {
            if(res.data.success) {
              await alert('Data berhasil disimpan');
              window.open('/farm', "_self");
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
                        <FormLabel>Farm Location</FormLabel>
                        <Input type="text" defaultValue={farmName ? farmName : ''} onChange={(e) => setFarmName(e.target.value)} name="farmName" />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                        <FormLabel>Link Google Maps Location</FormLabel>
                        <Input type="text" defaultValue={gmapslink ? gmapslink : ''} onChange={(e) => setGmapsLink(e.target.value)} name="mapsLink" />
                        </FormControl>
                    </Box>
                    </SimpleGrid>
                    <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                    <Box>
                        <FormControl isRequired>
                        <FormLabel>Latitude</FormLabel>
                        <Input type="text" defaultValue={latitude ? latitude : ''} onChange={(e) => setLatitude(e.target.value)} name="latitude" />
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isRequired>
                        <FormLabel>Longitude</FormLabel>
                        <Input type="text" defaultValue={longitude ? longitude : ''} onChange={(e) => setLongitude(e.target.value)} name="longitude" />
                        </FormControl>
                    </Box>
                    </SimpleGrid>
                    <SimpleGrid minChildWidth="50vw" spacing="4" mt="4">
                    <Box>
                        <FormControl isRequired>
                        <FormLabel>Elevation</FormLabel>
                        <Input type="text" defaultValue={elevation ? elevation : ''} onChange={(e) => setElevation(e.target.value)} name="elevation" />
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
                    <Button variant="outline" size="sm" onClick={() => submitFarm()} colorScheme="blue">
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

export default farm_edit
