import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { renderMarkdownResponse } from '../../utils/markdown';
import { FiPlus, FiRefreshCw, FiTrash, FiArrowLeft, FiBook, FiClipboard } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import { motion } from "framer-motion";
import { BsFillEmojiSmileFill, BsSend, BsImageFill } from "react-icons/bs";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { LeftNav } from '../navbar/LeftNav';

const ChatDetail = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const [theme, setTheme] = useState('light');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  // Add new message container styles
  const messageContainerStyle = {
    background: theme === 'light' ? 'white' : 'gray.800',
    borderRadius: '20px',
    boxShadow: 'lg',
    p: 6,
    mb: 4,
    height: 'calc(100vh - 180px)',
    overflowY: 'auto',
    scrollBehavior: 'smooth'
  };

  // Message bubble animations
  const messageAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  useEffect(() => {
    fetchMessages();
  }, [sessionId]);
  useEffect(() => {
    fetchSessions();
  }, []);

  // New fetchSessions function
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/chatbot-services/listSession");
      setSessions(response.data);
    } catch (error) {
      toast({
        title: "Error fetching sessions",
        description: error.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };


  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/chatbot-services/listMessages/%7Bsesion_id%7D?session_id=${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error Fetching Messages",
        description: error.response?.data?.detail || "An error occurred while fetching messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const response = await axiosInstance.post(`/chatbot-services/chat/`, null, {
        params: { query: newMessage, session_id: sessionId },
      });
      setMessages((prev) => [
        ...prev,
        { role: "user", content: newMessage },
        { role: "system", content: response.data.content },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: error.response?.data?.detail || "An error occurred while sending the message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setSending(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewSessionClick = () => {
    setIsNewSessionModalOpen(true);
  };

  const handleCreateNewSession = async () => {
    if (!newSessionName.trim()) {
      toast({
        title: "Session name is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/chatbot-services/createSession", null, {
        params: { session_name: newSessionName },
      });
      
      // Reset the form and close modal
      setNewSessionName("");
      setIsNewSessionModalOpen(false);
      
      // Fetch updated session list
      fetchSessions();
      
      // Navigate to the new session
      navigate(`/service/chat/${response.data.session_id}`);
      
      toast({
        title: "New session created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating session",
        description: error.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefreshSessions = () => {
    fetchSessions(); // Now uses the new fetchSessions function
  };

  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      await axiosInstance.delete(`/chatbot-services/deleteSession`, {
        params: { session_id: sessionIdToDelete },
      });
      toast({
        title: "Session Deleted",
        description: "The session has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Refresh sessions after deletion
      fetchSessions();
      // If the deleted session is the current one, navigate away
      if (sessionIdToDelete === sessionId) {
        navigate('/service/chat');
      }
    } catch (error) {
      toast({
        title: "Error Deleting Session",
        description: error.response?.data?.detail || "An error occurred while deleting the session.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh">
      {/* Left Navigation */}
      <Box w="15%">
        <LeftNav />
      </Box>

      {/* Sessions Sidebar - updated width */}
      <Box
        w="20%"
        bg={theme === 'light' ? 'white' : 'gray.800'}
        borderRight="1px"
        borderColor={theme === 'light' ? 'gray.200' : 'gray.600'}
        p={4}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">Sessions</Text>
          <HStack spacing={2} >
            <Button
              size="sm"
              leftIcon={<FiPlus />}
              colorScheme="green"
              variant="outline"
              onClick={handleNewSessionClick}
            >
              New
            </Button>
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              colorScheme="blue"
              variant="outline"
              onClick={handleRefreshSessions} // Uses the new fetchSessions function
            >
              Refresh
            </Button>
          </HStack>
        </Flex>
        <VStack spacing={3} align="stretch">
          {sessions.map((session) => (
            <Flex key={session.session_id} align="center" justify="space-between">
              <Button
                variant={session.session_id === sessionId ? "solid" : "ghost"}
                justifyContent="flex-start"
                onClick={() => navigate(`/service/chat/${session.session_id}`)}
                bg={session.session_id === sessionId ? "brand.400" : "transparent"}
                color={session.session_id === sessionId ? "white" : "black"}
                _hover={{ bg: "brand.300", color: "white" }}
                flex="1"
              >
                {session.session_name}
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleDeleteSession(session.session_id)}
                ml={2}
                title="Delete Session"
              >
                <FiTrash />
              </Button>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Main Chat Area - updated width */}
      <Box w="65%" position="relative" height="100vh" overflow="hidden">
        {/* Header with back button and service navigation */}
        <Flex justify="space-between" align="center" mb={6}>
          <Flex align="center">
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => navigate('/service/chat')}
              mr={4}
              color={theme === 'light' ? 'gray.800' : 'white'}
            >
              Back
            </Button>
            <Text fontSize="2xl" fontWeight="bold" 
                  color={theme === 'light' ? 'gray.800' : 'white'}>
              SuperChat
            </Text>
          </Flex>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiBook />}
              variant="ghost"
              onClick={() => navigate('/service/journal')}
              color={theme === 'light' ? 'gray.800' : 'white'}
            >
              Journal
            </Button>
            <Button
              leftIcon={<FiClipboard />}
              variant="ghost"
              onClick={() => navigate('/service/questionnaire')}
              color={theme === 'light' ? 'gray.800' : 'white'}
            >
              Questionnaire
            </Button>
            <Button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              variant="ghost"
              size="lg"
            >
              {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </Button>
          </HStack>
        </Flex>

        {/* Messages Container */}
        <Box {...messageContainerStyle}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id || index}
              {...messageAnimation}
            >
              <Flex
                justify={msg.role === "user" ? "flex-end" : "flex-start"}
                mb={4}
              >
                <Box
                  maxW="70%"
                  bg={msg.role === "user" ? "brand.500" : "gray.100"}
                  color={msg.role === "user" ? "white" : "gray.800"}
                  p={4}
                  borderRadius="20px"
                  borderTopRightRadius={msg.role === "user" ? "0" : "20px"}
                  borderTopLeftRadius={msg.role === "user" ? "20px" : "0"}
                >
                  {renderMarkdownResponse(msg.content)}
                </Box>
              </Flex>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area - Fixed at bottom */}
        <Flex
          position="fixed"
          bottom={6}
          left="35%"
          right={6}
          p={4}
          bg={theme === 'light' ? 'white' : 'gray.800'}
          borderRadius="full"
          boxShadow="lg"
          zIndex={2}
        >
          <Button
            variant="ghost"
            onClick={() => setShowEmojis(!showEmojis)}
            mr={2}
          >
            <BsFillEmojiSmileFill />
          </Button>
          <Button variant="ghost" mr={2}>
            <BsImageFill />
          </Button>
          <Input
            flex="1"
            variant="unstyled"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            colorScheme="brand"
            borderRadius="full"
            onClick={sendMessage}
            isLoading={sending}
          >
            <BsSend />
          </Button>
        </Flex>
      </Box>

      {/* Add the Modal */}
      <Modal isOpen={isNewSessionModalOpen} onClose={() => setIsNewSessionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Session Name</FormLabel>
              <Input
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Enter session name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateNewSession();
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsNewSessionModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleCreateNewSession}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ChatDetail;