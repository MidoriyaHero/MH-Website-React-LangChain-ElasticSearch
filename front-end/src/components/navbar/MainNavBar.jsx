import React from 'react'
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HStack, Button } from '@chakra-ui/react';

export const MainNavBar = () => {
  const navigate = useNavigate();
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const spacing = useBreakpointValue({ base: 2, md: 4 });
  return (
    <Flex bg="brand.500" p={4} justify="space-between" color="white" rounded="md">
      <Box fontWeight="bold" fontSize='2xl'>Lumos 🪄</Box>
      <HStack spacing={spacing}>

        <Button colorScheme="brand" size={buttonSize} variant="ghost" onClick={() => navigate('/service/guide')}>
          Hướng dẫn
        </Button>
      </HStack>
      <Outlet />
    </Flex>
  )
} 