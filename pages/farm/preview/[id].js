import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
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

const farm_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [overlay, setOverlay] = useState("");
  
  const [data, setData] = useState([]);
  const [processor, setProcessor] = useState(null);
  const [selectProcessor, setSelectProcessor] = useState(null);
  const [po, setPo] = useState(null);

  const token = users.token;

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
            <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
              <Box>
                <FormControl >
                  <FormLabel>Farm Location : <b>{data.farm_location}</b></FormLabel>
                </FormControl>
              </Box>
            </SimpleGrid>
            <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
              <Box>
                <FormControl >
                  <FormLabel>Link Google Maps Location : <Badge variant='solid' colorScheme='green'><a target='_blank' href={data.link_maps}> View</a> </Badge></FormLabel>
                </FormControl>
              </Box>
              <Box>
                <FormControl >
                  <FormLabel>Elevation : <b>{data.elevation} MASL (Meters Above Sea Level)</b></FormLabel>
                </FormControl>
              </Box>
            </SimpleGrid>
            <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
              <Box>
                <FormControl >
                  <FormLabel>Latitude : <b>{data.latitude}</b></FormLabel>
                </FormControl>
              </Box>
              <Box>
                <FormControl >
                  <FormLabel>Longitude : <b>{data.longitude}</b></FormLabel>
                </FormControl>
              </Box>
            </SimpleGrid>

            <br></br>
            <hr></hr>

            <Flex align="right" justify="space-between">
              <Box p='4'>
                <Link href={`/farm`} passHref={true}>
                  <Button variant="outline" size="sm" colorScheme="grey">
                    Back
                  </Button>
                </Link>
              </Box>
              {/* <Box p='4'>
                <Link href={`/farm/edit/${encodeURIComponent(data.id)}`} passHref={true}>
                  <Button variant="outline" size="sm" colorScheme="yellow">
                    Edit
                  </Button>
                </Link>
              </Box> */}
            </Flex>

          </Box>
        </Box>
      </Box>
    </>
  );
}

export default farm_preview
