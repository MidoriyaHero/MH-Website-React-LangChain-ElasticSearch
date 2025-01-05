import React from 'react'
import { Flex, Box, HStack, Button } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

export const HomeNavBar = () => {
    const navigate = useNavigate()
  return (
    <Flex bg="brand.500" p={4} justify="space-between" color="white" rounded="md">
    <Box fontWeight="bold" fontSize='2xl'>Lumos 🪄</Box>
    <HStack spacing={4}>
        <Button leftIcon={<FiLogIn />} variant='ghost' colorScheme="White" onClick={() => navigate('/login')}>
            Đăng nhập
        </Button>
        <Button colorScheme="brand" onClick={() => navigate('/register')}>
            Đăng ký
        </Button>
    </HStack>
    <Outlet/>
  </Flex>
  )
}
