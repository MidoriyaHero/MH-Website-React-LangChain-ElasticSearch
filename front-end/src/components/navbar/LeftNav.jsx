import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
  Button,
} from '@chakra-ui/react';
import { FiHome, FiMessageCircle, FiBook, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


export const LeftNav = () => {
  const navigate = useNavigate();

  return (
    <Box
      w="100%"
      h="100vh"
      bg="brand.50"
      p={4}
      borderRight="1px solid"
      borderColor="gray.200"
    >
      {/* User Greeting */}
      <Flex direction="column" align="center" mb={8}>
        <Box
          bg="brand.400"
          color="white"
          p={6}
          borderRadius="full"
          boxSize="60px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
        >
          <Text fontSize="2xl" fontWeight="bold">
            U
          </Text>
        </Box>
        <Heading as="h2" size='md' mb={2} color="brand.600">
          Hello, User!
        </Heading>
        <Text fontSize='xl' color="gray.600">
          Welcome back!
        </Text>
      </Flex>

      <Divider mb={6} />

      {/* Navigation Menu */}
      <VStack spacing={4} align="stretch">
        <Button
          leftIcon={<FiHome />}
          justifyContent="flex-start"
          bg="brand.300"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button
          leftIcon={<FiMessageCircle />}
          justifyContent="flex-start"
          bg="brand.300"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/service/chat')}
        >
          Chat
        </Button>
        <Button
          leftIcon={<FiBook />}
          justifyContent="flex-start"
          bg="brand.300"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/service/journal')}
        >
          Daily Journal
        </Button>
      </VStack>

      <Divider mt={6} mb={6} />

      {/* Logout Button */}
      <Flex mt="auto" direction="column" align="center">
        <Button
          leftIcon={<FiLogOut />}
          justifyContent="flex-start"
          w="100%"
          color="red.500"
          variant="ghost"
          _hover={{ bg: "red.50" }}
          onClick={() => console.log('Logout clicked')}
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
