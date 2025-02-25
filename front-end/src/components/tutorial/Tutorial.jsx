import React from 'react';
import {
    Box,
    Heading,
    Text,
    List,
    ListItem,
    ListIcon,
    VStack,
    Button,
    Image
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const UserGuide = () => {
    const navigate = useNavigate();

    return (
        <Box p={6} maxW="600px" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="md">
            <Button leftIcon={<ArrowBackIcon />} mb={4} variant="ghost" onClick={() => navigate(-1)}>
                Trở về
            </Button>
            <Heading as="h2" size="lg" mb={4} textAlign="center" color="brand.600">
                Hướng Dẫn Sử Dụng
            </Heading>
            <Text fontSize="md" mb={4} textAlign="center" color="gray.600">
                Để Lumos hiểu được cảm xúc và tình trạng hiện tại của bạn, hãy làm theo các bước dưới đây:
            </Text>
            <VStack align="start" spacing={4}>
                <List spacing={3}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Trước tiên, viết nhật ký để Lumos có thể hiểu rõ cảm xúc và tâm trạng của bạn.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Hoàn thành bảng câu hỏi (Questionnaire) để đánh giá sức khỏe của bạn.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Sau khi có nhật ký và kết quả đánh giá, hãy bắt đầu chat với Lumos để nhận được lời khuyên phù hợp.
                    </ListItem>
                </List>
            </VStack>
            <Box textAlign="center" mt={6}>
                <a href="https://bme.hcmiu.edu.vn/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="https://bme.hcmiu.edu.vn/wp-content/uploads/2024/07/bmelogo2-2.png"
                        alt="Lumos Logo"
                        boxSize="auto"
                        mx="auto"
                        cursor="pointer"
                    />
                </a>
                <Text mt={2} fontSize="sm" color="gray.600">
                    Truy cập website của BME
                </Text>
            </Box>
        </Box>
    );
};

export default UserGuide;
