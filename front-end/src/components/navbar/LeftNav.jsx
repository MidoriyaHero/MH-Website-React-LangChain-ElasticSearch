import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
  Button,
  Tooltip,
  Avatar,
  useColorMode,
} from '@chakra-ui/react';
import { FiHome, FiMessageCircle, FiBook, FiLogOut, FiClipboard, FiSettings } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from "../../services/axios";

export const LeftNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { colorMode } = useColorMode();

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const navigateToLatestChat = async () => {
    try {
      const response = await axiosInstance.get("/chatbot-services/listSession");
      if (response.data && response.data.length > 0) {
        // Navigate to the most recent session (assuming sessions are ordered by recency)
        navigate(`/service/chat/${response.data[0].session_id}`);
      } else {
        // If no sessions exist, go to the default chat route
        navigate('/service/chat');
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      // On error, fallback to default chat route
      navigate('/service/chat');
    }
  };

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/service/home' },
    { icon: FiMessageCircle, label: 'Chat', path: 'chat', onClick: navigateToLatestChat },
    { icon: FiBook, label: 'Daily Journal', path: '/service/journal' },
    { icon: FiClipboard, label: 'Questionnaire', path: '/service/questionnaire' },
    { icon: FiSettings, label: 'Settings', path: '/service/settings' },
  ];

  return (
    <Box
      w="100%"
      h="100vh"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      p={4}
      borderRight="1px solid"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      position="sticky"
      top="0"
      transition="all 0.2s"
    >
      {/* User Profile Section */}
      <Flex direction="column" align="center" mb={8}>
        <Avatar
          size="lg"
          name={user?.user_name}
          bg="brand.400"
          color="white"
          mb={4}
          cursor="pointer"
          _hover={{ transform: 'scale(1.05)' }}
          transition="transform 0.2s"
          onClick={() => navigate('/service/settings')}
        />
        <Heading as="h2" size="md" mb={2} color="brand.600">
          {user?.user_name}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {user?.email}
        </Text>
      </Flex>

      <Divider mb={6} />

      {/* Navigation Menu */}
      <VStack spacing={3} align="stretch">
        {navItems.map((item) => (
          <Tooltip key={item.path} label={item.label} placement="right">
            <Button
              leftIcon={<item.icon />}
              justifyContent="flex-start"
              bg={isActiveRoute(item.path) ? 'brand.500' : 'transparent'}
              color={isActiveRoute(item.path) ? 'white' : 'inherit'}
              _hover={{
                bg: 'brand.400',
                color: 'white',
                transform: 'translateX(5px)',
              }}
              onClick={item.onClick || (() => navigate(item.path))}
              variant="ghost"
              size="lg"
              w="100%"
              transition="all 0.2s"
            >
              {item.label}
            </Button>
          </Tooltip>
        ))}
      </VStack>

      <Divider my={6} />

      {/* Logout Button */}
      <Tooltip label="Logout" placement="right">
        <Button
          leftIcon={<FiLogOut />}
          justifyContent="flex-start"
          w="100%"
          color="red.500"
          variant="ghost"
          _hover={{
            bg: 'red.50',
            transform: 'translateX(5px)',
          }}
          onClick={logout}
          size="lg"
          transition="all 0.2s"
        >
          Logout
        </Button>
      </Tooltip>
    </Box>
  );
};
