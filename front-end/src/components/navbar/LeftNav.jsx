import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { FiHome, FiMessageCircle, FiBook, FiLogOut, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LeftNav = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleClick = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      w="100%"
      h="100vh"
      bg="brand.50"
      p={4}
      borderRight="1px solid"
      borderColor="gray.200"
      position="sticky"
      top="0"
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
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.1)' }}
        >
          <Text fontSize="2xl" fontWeight="bold">
            {user ? user.user_name.charAt(0).toUpperCase() : "U"}
          </Text>
        </Box>
        <Heading as="h2" size="md" mb={2} color="brand.600">
          Hello, {user ? user.user_name : "User"}!
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Welcome back!
        </Text>
      </Flex>

      <Divider mb={6} />

      {/* Navigation Menu */}
      <VStack spacing={4} align="stretch">
        <Tooltip label="Home" aria-label="Home tooltip">
          <Button
            leftIcon={<FiHome />}
            justifyContent="flex-start"
            bg="brand.300"
            _hover={{ bg: "brand.500" }}
            onClick={() => navigate('/service/home')}
            variant="solid"
            size="md"
          >
            Home
          </Button>
        </Tooltip>
        <Tooltip label="Chat" aria-label="Chat tooltip">
          <Button
            leftIcon={<FiMessageCircle />}
            justifyContent="flex-start"
            bg="brand.300"
            _hover={{ bg: "brand.500" }}
            onClick={() => navigate('/service/chat')}
            variant="solid"
            size="md"
          >
            Chat
          </Button>
        </Tooltip>
        <Tooltip label="Daily Journal" aria-label="Daily Journal tooltip">
          <Button
            leftIcon={<FiBook />}
            justifyContent="flex-start"
            bg="brand.300"
            _hover={{ bg: "brand.500" }}
            onClick={() => navigate('/service/journal')}
            variant="solid"
            size="md"
          >
            Daily Journal
          </Button>
        </Tooltip>
        <Tooltip label="Questionnaire" aria-label="Questionnaire tooltip">
          <Button
            leftIcon={<FiClipboard />}
            justifyContent="flex-start"
            bg="brand.300"
            _hover={{ bg: "brand.500" }}
            onClick={() => navigate('/service/questionnaire')}
            variant="solid"
            size="md"
          >
            Questionnaire
          </Button>
        </Tooltip>
      </VStack>

      <Divider mt={6} mb={6} />

      {/* Logout Button */}
      <Flex mt="auto" direction="column" align="center">
        <Tooltip label="Logout" aria-label="Logout tooltip">
          <Button
            leftIcon={<FiLogOut />}
            justifyContent="flex-start"
            w="100%"
            color="red.500"
            variant="ghost"
            _hover={{ bg: "red.50" }}
            onClick={handleClick}
            size="md"
          >
            Logout
          </Button>
        </Tooltip>
      </Flex>
    </Box>
  );
};
