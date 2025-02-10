import React from 'react';
import { Box, Button, Flex, Heading, Text, VStack, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box w="100%" minH="100vh" bg="brand.50" p={{ base: 2, md: 4 }}>
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="white"
        p={{ base: 4, md: 8 }}
        rounded="md"
        shadow="lg"
        textAlign="center"
        mb={{ base: 6, md: 10 }}
        maxW={{ base: "95%", md: "80%" }}
        mx="auto"
      >
        <Heading 
          size={{ base: "xl", md: "2xl" }} 
          mb={{ base: 3, md: 4 }} 
          color='brand.600'
          textAlign="center"
        >
          Trò Chuyện Mượt Mà, Suy Ngẫm Sâu Sắc
        </Heading>
        <Text 
          fontSize={{ base: "md", md: "lg" }} 
          color='brand.700' 
          mb={{ base: 4, md: 6 }}
          px={{ base: 2, md: 4 }}
        >
          Tham gia các cuộc trò chuyện thông minh và ghi lại suy nghĩ của bạn với tính năng viết nhật ký của chúng tôi.
        </Text>
        <Stack 
          direction={{ base: "column", md: "row" }} 
          spacing={{ base: 3, md: 6 }}
          w="100%"
          px={{ base: 4, md: 0 }}
        >
          <Button 
            colorScheme="brand" 
            size={{ base: "md", md: "lg" }}
            w={{ base: "100%", md: "auto" }}
            onClick={() => navigate('/service/chat')}
          >
            Bắt Đầu Trò Chuyện
          </Button>
          <Button 
            variant="outline" 
            colorScheme="brand" 
            size={{ base: "md", md: "lg" }}
            w={{ base: "100%", md: "auto" }}
            onClick={() => navigate('/service/journal')}
          >
            Viết Nhật Ký
          </Button>
        </Stack>
        <Text 
          fontSize={{ base: "sm", md: "lg" }} 
          color='brand.700' 
          mt={{ base: 4, md: 6 }}
          display={{ base: "none", md: "block" }}
        >
          (vui lòng sử dụng trình duyệt web để có trải nghiệm tốt nhất)
        </Text>
      </Flex>

      {/* Features Section */}
      <VStack 
        spacing={{ base: 4, md: 6 }} 
        mb={{ base: 6, md: 10 }} 
        maxW="1200px" 
        mx="auto"
        px={{ base: 2, md: 4 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={{ base: 4, md: 6 }}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading 
            size={{ base: "sm", md: "md" }} 
            mb={{ base: 2, md: 0 }}
          >
            Trò Chuyện Thông Minh
          </Heading>
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color="brand.700" 
            maxW="400px"
          >
            Trò chuyện được hỗ trợ bởi AI để trợ giúp tức thì và các cuộc hội thoại hấp dẫn.
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={{ base: 4, md: 6 }}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading 
            size={{ base: "sm", md: "md" }} 
            mb={{ base: 2, md: 0 }}
          >
            Nhật Ký Hàng Ngày
          </Heading>
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color="brand.700" 
            maxW="400px"
          >
            Ghi lại và tổ chức suy nghĩ hàng ngày của bạn một cách dễ dàng.
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          bg="brand.100"
          p={{ base: 4, md: 6 }}
          rounded="md"
          shadow="sm"
          w="100%"
          justify="space-around"
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading 
            size={{ base: "sm", md: "md" }} 
            mb={{ base: 2, md: 0 }}
          >
            Thông Tin Cá Nhân Hóa
          </Heading>
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color="brand.700" 
            maxW="400px"
          >
            Nhận các gợi ý và tóm tắt được cá nhân hóa để cải thiện sự tự suy ngẫm.
          </Text>
        </Flex>
      </VStack>

      {/* Footer Section */}
      <Flex 
        justify="center" 
        bg="brand.200" 
        p={{ base: 3, md: 4 }} 
        rounded="md" 
        shadow="sm" 
        maxW="1200px" 
        mx="auto"
        mt={{ base: 4, md: 8 }}
      >
        <Text fontSize={{ base: "sm", md: "md" }}>
          © 2024 BME LAB 513
        </Text>
      </Flex>
    </Box>
  );
};

export default Home;
