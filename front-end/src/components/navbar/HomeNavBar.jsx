import React from 'react'
import { Flex, Box, HStack, Button } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';

export const HomeNavBar = () => {
    const navigate = useNavigate()
  return (
    <Flex bg="brand.500" p={4} justify="space-between" color="white" rounded="md">
    <Box fontWeight="bold" fontSize='2xl' >MentalHealth Website</Box>
    <HStack spacing={4}>
        <Button variant='ghost' colorScheme="White" onClick={() => navigate('/login')}>
            Login
        </Button>
        <Button colorScheme="brand" onClick={() => navigate('/signup')}>
            Sign up 
        </Button>
    </HStack>
    <Outlet/>
  </Flex>
  )
}
