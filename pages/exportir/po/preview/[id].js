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

const po_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState([]);
  const [processor, setProcessor] = useState(null);
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
        setPo(res.data.po);
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataPo();
    } else {
      return;
    }
  }, []);

  if(po) {
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
                <Heading size="lg">PO Preview</Heading>
              </Box>
              <br></br>
              <hr></hr>
              <br></br>
              <Box>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>PO Number : <b>{po.po_number}</b></FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl >
                      <FormLabel>Processor : <b>{po.get_processor.processor_name}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
    
                <br></br>
                <hr></hr>
    
                <Flex align="right" justify="space-between">
                  <Box p='4'>
                    <Link href={`/exportir/po`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="grey">
                        Back
                      </Button>
                    </Link>
                  </Box>
                  <Box p='4'>
                    <Link href={`/exportir/po/edit/${encodeURIComponent(data.id)}`} passHref={true}>
                      <Button variant="outline" size="sm" colorScheme="yellow">
                        Edit
                      </Button>
                    </Link>
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

export default po_preview
