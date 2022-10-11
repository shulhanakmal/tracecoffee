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

const processor_preview = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id;

  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState([]);
  const [farm, setFarm] = useState([]);
  const [processor, setProcessor] = useState(null);
  const [selectProcessor, setSelectProcessor] = useState(null);
  const [po, setPo] = useState(null);

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
          setFarm(res.data.farm);
        },
        (err) => {
          console.log("AXIOS ERROR: ", err.message);
        }
    );

  };

  useEffect(() => {

    if(id) {
        getDataProcessor();
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
                <Heading size="lg">Farm Preview</Heading>
              </Box>
              <br></br>
              <hr></hr>
              <br></br>
              <Box>
                <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                  <Box>
                    <FormControl >
                      <FormLabel>Processor name : <b>{processor.processor_name}</b></FormLabel>
                    </FormControl>
                  </Box>
                </SimpleGrid>
                
                <TableContainer>
                  <Table my="8" borderWidth="1px" fontSize="sm">
                    <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                      <Tr>
                        <Th> No </ Th>
                        <Th> Farm </ Th>
                        <Th> Location </ Th>
                        <Th> Latitude - Longitude </ Th>
                        <Th> Elevation </ Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {farm.map((row, index) => (
                        <Tr key={index}>
                          <Td> {index+1} </Td>
                          <Td> {row.farm_location} </Td>
                          <Td> <Badge variant='solid' colorScheme='green'><a target='_blank' href={row.link_maps}> Maps</a> </Badge></Td>
                          <Td> {row.latitude} - {row.longitude}</Td>
                          <Td> {row.elevation} MASL (Meters Above Sea Level) </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
    
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
                    {/* <Link href={`/processor/edit/${encodeURIComponent(processor.id)}`} passHref={true}>
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
