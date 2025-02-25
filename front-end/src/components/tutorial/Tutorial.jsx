import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    List,
    ListItem,
    ListIcon,
    VStack,
    Image,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    useBreakpointValue
} from '@chakra-ui/react';
import { CheckCircleIcon, HamburgerIcon } from '@chakra-ui/icons';
import { LeftNav } from '../navbar/LeftNav';

const UserGuide = ({ isInModal = false }) => {
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [isNavOpen, setIsNavOpen] = useState(false);

    // Content section that's the same regardless of where it's displayed
    const GuideContent = () => (
        <Box p={6} maxW={isInModal ? "100%" : "600px"} mx="auto" bg="gray.50" borderRadius="lg" boxShadow="md" flex="1">
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
                        alt="Logo"
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

    // If in modal, just show the guide content without navigation
    if (isInModal) {
        return <GuideContent />;
    }

    // Otherwise show the full page with navigation
    return (
        <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
            {isMobile && (
                <IconButton
                    icon={<HamburgerIcon />}
                    position="fixed"
                    top={4}
                    left={4}
                    zIndex={20}
                    onClick={() => setIsNavOpen(true)}
                    aria-label="Open navigation"
                />
            )}

            {isMobile ? (
                <Drawer isOpen={isNavOpen} placement="left" onClose={() => setIsNavOpen(false)}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody p={0}>
                            <LeftNav isDrawer={true} />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box w="15%">
                    <LeftNav />
                </Box>
            )}

            <GuideContent />
        </Box>
    );
};

export default UserGuide;