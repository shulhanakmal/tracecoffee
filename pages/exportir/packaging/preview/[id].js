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

const batch_preview = () => {
  const router = useRouter()
  const { id } = router.query
  let users = JSON.parse(localStorage.getItem("users"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  
  const [data, setData] = useState([]);
  const [batch, setBatch] = useState(null);

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
        setBatch(res.data.batch)
      },
      (err) => {
        alert("AXIOS ERROR: ", err.message);
      }
    );

  };

  useEffect(() => {
    if(id) {
        getDataPackaging();
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
              <Heading size="lg">Packaging Preview</Heading>
            </Box>
            <br></br>
            <hr></hr>
            <br></br>
            <Box>
              <SimpleGrid minChildWidth="20vw" mt="4" spacing="4">
                <Box>
                  <FormControl >
                    <FormLabel>SKU : <b>{data.get_sku ? `${data.get_sku.sku} - ${data.get_sku.sku_name}` : ``}</b></FormLabel>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl >
                    <FormLabel>Volume : <b>{data ? data.volume : ''}</b></FormLabel>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <TableContainer>
                <Table my="8" borderWidth="1px" fontSize="sm">
                  <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                    <Tr>
                      <Th> No </ Th>
                      <Th> SKU </ Th>
                      <Th> Harversting Year </ Th>
                      <Th> PO </ Th>
                      <Th> Batch Number </ Th>
                      <Th> Species </ Th>
                      <Th> Variety </ Th>
                      <Th> Process </ Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {batch && batch.map((row, index) => (
                      <Tr key={index}>
                        <Td> {index+1} </Td>
                        <Td> {row.get_sku.sku} </Td>
                        <Td> {moment(row.harvesting_year).format('DD / MMM / YYYY')} </Td>
                        <Td> {row.get_po.po_number} </Td>
                        <Td> {row.batch_number} </Td>
                        <Td> {row.species} </Td>
                        <Td> {row.variety} </Td>
                        <Td> {row.process_name} </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
  
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
                  {/* <Link href={`/exportir/batch/edit/${encodeURIComponent(data.id)}`} passHref={true}>
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

export default batch_preview