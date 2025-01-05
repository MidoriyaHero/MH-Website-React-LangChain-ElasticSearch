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
          Trò Chuyện Mượt Mà, Suy Ngẫm Sâu Sắc
        </Heading>
        <Text fontSize="lg" color='brand.700' mb={6}>
          Tham gia các cuộc trò chuyện thông minh và ghi lại suy nghĩ của bạn với tính năng viết nhật ký của chúng tôi.
        </Text>
        <HStack spacing={6}>
          <Button colorScheme="brand" size="lg" onClick={() => navigate('/service/chat')}>
            Bắt Đầu Trò Chuyện
          </Button>
          <Button variant="outline" colorScheme="brand" size="lg" onClick={() => navigate('/service/journal')}>
            Viết Nhật Ký
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
            Trò Chuyện Thông Minh
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            Trò chuyện được hỗ trợ bởi AI để trợ giúp tức thì và các cuộc hội thoại hấp dẫn.
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
            Nhật Ký Hàng Ngày
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            Ghi lại và tổ chức suy nghĩ hàng ngày của bạn một cách dễ dàng.
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
            Thông Tin Cá Nhân Hóa
          </Heading>
          <Text fontSize="md" color="brand.700" align="center" maxW="400px">
            Nhận các gợi ý và tóm tắt được cá nhân hóa để cải thiện sự tự suy ngẫm.
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
