import React from 'react';
import { Box, Button, Flex, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  return (
    <Box w="100%" h="100vh" bg="brand.50" p={4} >
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
      >
        <Heading size="xl" mb={4} color='brand.400' >
          Chat Seamlessly, Reflect Deeply
        </Heading>
        <Text fontSize="lg" color='brand.700' mb={6}>
          Engage in intelligent conversations and keep track of your thoughts with our journaling feature.
        </Text>
        <HStack spacing={4}>
          <Button colorScheme="brand" onClick={() => navigate('/chat')}>
            Start Chatting
          </Button>
          <Button variant="outline" colorScheme="brand" onClick={() => navigate('/daily-journal')}>
            Write a Journal
          </Button>
        </HStack>
      </Flex>

      {/* Features Section */}
      <VStack spacing={6} mb={10}>
        <Flex
          direction="column"
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          maxW="400px"
        >
          <Heading size="md" mb={2}>
            Smart Chat
          </Heading>
          <Text fontSize="sm" color="brand.700" align="center">
            AI-powered chat for instant assistance and conversations.
          </Text>
        </Flex>
        <Flex
          direction="column"
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          maxW="400px"
        >
          <Heading size="md" mb={2}>
            Daily Journal
          </Heading>
          <Text fontSize="sm" color="brand.700" align="center">
            Record and organize your daily thoughts.
          </Text>
        </Flex>
        <Flex
          direction="column"
          align="center"
          bg="brand.100"
          p={6}
          rounded="md"
          shadow="sm"
          w="100%"
          maxW="400px"
        >
          <Heading size="md" mb={2}>
            Personalized Insights
          </Heading>
          <Text fontSize="sm" color="brand.700" align="center">
            Get tailored suggestions and summaries for better self-reflection.
          </Text>
        </Flex>
      </VStack>

      {/* Footer Section */}
      <Flex justify="space-between" bg="brand.200" p={4} rounded="md" shadow="sm">
        <Text>© 2024 MentalHealth Website</Text>
      </Flex>
    </Box>
  );
};

export default Home;
