import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { renderMarkdownResponse } from '../../utils/markdown';
import { FiPlus, FiRefreshCw, FiTrash } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';

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

  const handleCreateNewSession = () => {
    navigate('/service/chat');
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
      {/* Sidebar */}
      <Box w={{ base: "100%", md: "25%" }} bg="gray.100" p={4} overflowY="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">Sessions</Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<FiPlus />}
              colorScheme="green"
              variant="outline"
              onClick={handleCreateNewSession}
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

      {/* Main Chat Area */}
      <Box p={4} height="100vh" w={{ base: "100%", md: "75%" }} display="flex" flexDirection="column">
        <Flex align="center" mb={4}>
          <Button colorScheme="teal" size="sm" onClick={() => navigate("/service/chat")}>
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold" ml={4}>
            SuperChat
          </Text>
        </Flex>
        <Box flex="1" overflowY="auto" borderWidth="1px" borderRadius="lg" p={4} mb={4}>
          {loading ? (
            <Flex justify="center" align="center" height="100%">
              <Spinner size="xl" color="brand.400" />
            </Flex>
          ) : (
            <VStack spacing={3} align="stretch">
              {messages.map((msg, index) => (
                <Box
                  key={msg.id || index}
                  alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                  bg={msg.role === "user" ? "teal.200" : "blue.100"}
                  
                  px={4}
                  py={2}
                  borderRadius="md"
                  boxShadow="md"
                  maxWidth="80%"
                >
                  <Text fontWeight="bold">{msg.role === "user" ? "Tôi" : "Trợ thủ tinh thần"}</Text>
                  <Text>{renderMarkdownResponse(msg.content)}</Text>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Box>
        <HStack spacing={2}>
          <Input
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            isDisabled={sending}
            bg="white"
          />
          <Button colorScheme="blue" onClick={sendMessage} isLoading={sending}>
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default ChatDetail;