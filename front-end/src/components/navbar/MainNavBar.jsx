import React from 'react'
import { Flex, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const MainNavBar = () => {
  return (
    <Flex bg="brand.500" p={4} justify="space-between" color="white" rounded="md">
      <Box fontWeight="bold" fontSize='2xl'>Lumos 🪄</Box>
      <Outlet/>
    </Flex>
  )
} 