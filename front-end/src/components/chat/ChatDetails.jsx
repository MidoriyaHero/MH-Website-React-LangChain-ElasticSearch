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
  IconButton,
} from "@chakra-ui/react";
import { renderMarkdownResponse } from '../../utils/markdown';
import { FiPlus, FiRefreshCw, FiTrash } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import { motion } from "framer-motion";
import { BsFillEmojiSmileFill, BsSend, BsImageFill } from "react-icons/bs";
import { LeftNav } from '../navbar/LeftNav';
import { useColorMode } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useBreakpointValue, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from '@chakra-ui/react';

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
  const { colorMode } = useColorMode();
  const [showEmojis, setShowEmojis] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  
  // Add responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Modify the layout sections with responsive widths
  const leftNavWidth = isMobile ? "0" : "15%";
  const sessionsWidth = isMobile ? "0" : "20%";
  const chatWidth = isMobile ? "100%" : "65%";

  // Update message container styles
  const messageContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    height: '100%',
    px: 4,
    py: 2,
    scrollBehavior: 'smooth',
  };

  // Message bubble animations
  const messageAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  useEffect(() => {
    console.log("SessionId changed:", sessionId); // Debug log
    if (sessionId) {
      fetchMessages();
    }
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
      const messagesList = response.data;
      console.log("Fetched messages:", messagesList);
      
      // Always include the welcome message at the start of the messages array
      const welcomeMessage = { role: "system", content: "Xin chào, mình là Lumos! 🪄 Hôm nay bạn cảm thấy thế nào? Kể mình nghe nhé!" };
      
      if (!messagesList || messagesList.length === 0) {
        setMessages([welcomeMessage]);
      } else {
        // Combine welcome message with existing messages
        setMessages([welcomeMessage, ...messagesList]);
      }
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
      const newSessionId = response.data.session_id;
      navigate(`/service/chat/${newSessionId}`);
      
      // Immediately set the welcome message
      setMessages([
        { role: "system", content: "Xin chào, mình là Lumos! 🪄 Hôm nay bạn cảm thấy thế nào? Kể mình nghe nhé!" }
      ]);
      
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

  // Modify the initial view when no session is selected
  const renderInitialView = () => {
    if (!sessionId) {
      return (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          h="100%" 
          p={8}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
        >
          <Text fontSize="2xl" mb={6} textAlign="center">
            Chào mừng đến với Lumos Chat! 🪄
          </Text>
          <Text fontSize="lg" mb={8} textAlign="center" color="gray.600">
            Lumos chat có thể dùng thông tin từ nhật ký và kết quả test của bạn để đưa ra phản hồi phù hợp hơn!
          </Text>
          <Button
            colorScheme="brand"
            size="lg"
            leftIcon={<FiPlus />}
            onClick={handleNewSessionClick}
          >
            Tại session mới
          </Button>
        </Flex>
      );
    }
    return null;
  };

  return (
    <Flex height="100vh">
      {/* Mobile Navigation Buttons */}
      {isMobile && (
        <>
          <IconButton
            icon={<HamburgerIcon />}
            position="fixed"
            top={4}
            left={4}
            zIndex={20}
            onClick={() => setIsNavOpen(true)}
            aria-label="Open navigation"
          />
          <Button
            position="fixed"
            top={4}
            right={4}
            zIndex={20}
            onClick={() => setIsSessionsOpen(true)}
            size="sm"
            variant="solid"
            colorScheme="brand"
          >
            Sessions
          </Button>
        </>
      )}

      {/* Left Navigation - Responsive */}
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
        <Box w={leftNavWidth}>
          <LeftNav />
        </Box>
      )}

      {/* Sessions Sidebar - Responsive */}
      {isMobile ? (
        <Drawer isOpen={isSessionsOpen} placement="right" onClose={() => setIsSessionsOpen(false)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              p={4}
            >
              {/* Sessions content */}
              <Flex justify="space-between" align="center" marginTop={10} >
                <Text fontSize="lg" fontWeight="bold" mr={2} >  Sessions </Text>
                <HStack spacing={1} >
                  <Button
                    size="sm"
                    leftIcon={<FiPlus />}
                    colorScheme="green"
                    variant="outline"
                    onClick={handleNewSessionClick}
                  >
                    Chat mới
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
                      marginTop={5}
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
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Box w={sessionsWidth}>
          <Flex justify="space-between" align="center" mt={10} mb={10}>
            <Text fontSize="lg" fontWeight="bold" ml={2}>Sessions</Text>
            <HStack spacing={2} >
              <Button
                size="sm"
                leftIcon={<FiPlus />}
                colorScheme="green"
                variant="outline"
                onClick={handleNewSessionClick}
                ml={4}
              >
                Chat mới
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
      )}

      {/* Main Chat Area */}
      <Flex 
        w={chatWidth} 
        direction="column" 
        height="100vh"
        position="relative"
      >
        {/* Header */}
        <Flex 
          justify="space-between" 
          align="center" 
          p={4}
          shrink={0} // Prevent header from shrinking
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderBottom="1px"
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          position="sticky"
          top={0}
          zIndex={1}
          ml={10}
        >
          <Text 
            fontSize="2xl" 
            fontWeight="bold" 
            color={colorMode === 'light' ? 'gray.800' : 'white'}
          >
            🪄 Lumos
          </Text>
        </Flex>

        {/* Messages Area */}
        {!sessionId ? (
          renderInitialView()
        ) : (
          <Flex 
            direction="column"
            flex={1}
            overflow="hidden" // Contains the scroll
            position="relative"
            pb="80px" // Space for input area
          >
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

            {/* Input Area */}
            <Flex
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              p={4}
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderTop="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
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
                placeholder="Nhập tin nhắn..."
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
          </Flex>
        )}
      </Flex>

      {/* Keep existing Modal code */}
      <Modal isOpen={isNewSessionModalOpen} onClose={() => setIsNewSessionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo session mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Tên session</FormLabel>
              <Input
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Nhập tên session"
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
              Hủy
            </Button>
            <Button colorScheme="brand" onClick={handleCreateNewSession}>
              Tạo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ChatDetail;