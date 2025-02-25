import React from 'react';
import { Flex, Box, HStack, Button, useBreakpointValue } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

export const HomeNavBar = () => {
    const navigate = useNavigate();

    // Responsive sizes
    const paddingX = useBreakpointValue({ base: 2, sm: 4, md: 6, lg: 8 });
    const fontSize = useBreakpointValue({ base: "lg", md: "2xl" });
    const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
    const spacing = useBreakpointValue({ base: 2, md: 4 });

    return (
        <Flex
            bg="brand.500"
            px={paddingX}
            py={3}
            justify="space-between"
            align="center"
            color="white"
            rounded="md"
            w="100%"
        >
            <Box fontWeight="bold" fontSize={fontSize}>Lumos 🪄</Box>

            <HStack spacing={spacing}>
                <Button leftIcon={<FiLogIn />} variant="ghost" size={buttonSize} onClick={() => navigate('/login')}>
                    Đăng nhập
                </Button>
                <Button colorScheme="brand" size={buttonSize} onClick={() => navigate('/register')}>
                    Đăng ký
                </Button>
                <Button colorScheme="brand" size={buttonSize} variant="ghost" onClick={() => navigate('/service/guide')}>
                    Hướng dẫn
                </Button>
            </HStack>

            <Outlet />
        </Flex>
    );
};