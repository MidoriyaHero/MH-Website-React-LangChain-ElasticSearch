import React from 'react';
import { Box, Button, Flex, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box w="100%" minH="100vh" bg="brand.50" p={4}>
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        textAlign="center"
        mb={10}
        maxW="80%" 
        mx="auto"
      >
        <Heading size="2xl" mb={4} color='brand.600'>
          Chat Seamlessly, Reflect Deeply
        </Heading>
        <Text fontSize="lg" color='brand.700' mb={6}>
          Engage in intelligent conversations and keep track of your thoughts with our journaling feature.
        </Text>
        <HStack spacing={6}>
          <Button colorScheme="brand" size="lg" onClick={() => navigate('/service/chat')}>
            Start Chatting
          </Button>
          <Button variant="outline" colorScheme="brand" size="lg" onClick={() => navigate('/service/journal')}>
            Write a Journal
          </Button>
        </HStack>
      </Flex>

      {/* Features Section */}
      <VStack spacing={6} mb={10} maxW="1200px" mx="auto">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
        >
          <Heading size="md" mb={{ base: 2, md: 0 }}>
            Smart Chat
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            AI-powered chat for instant assistance and engaging conversations.
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
        >
          <Heading size="md" mb={{ base: 2, md: 0 }}>
            Daily Journal
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            Record and organize your daily thoughts with ease.
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
        >
          <Heading size="md" mb={{ base: 2, md: 0 }}>
            Personalized Insights
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            Get tailored suggestions and summaries for better self-reflection.
          </Text>
        </Flex>
      </VStack>

      {/* Footer Section */}
      <Flex justify="center" bg="brand.200" p={4} rounded="md" shadow="sm" maxW="1200px" mx="auto">
        <Text>© 2024 BME LAB 513</Text>
      </Flex>
    </Box>
  );
};

export default Home;
