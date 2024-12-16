import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { Box, Button, Flex, Input, Spinner, Text, VStack, HStack, useToast } from "@chakra-ui/react";
import { renderMarkdownResponse } from '../../utils/markdown';

const ChatDetail = () => {
  const { sessionId } = useParams(); // Get sessionId from URL params
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [loading, setLoading] = useState(false); // Loading state
  const [newMessage, setNewMessage] = useState(""); // State for user's input message
  const [sending, setSending] = useState(false); // State for sending message
  const navigate = useNavigate();
  const toast = useToast();
  
  const messagesEndRef = useRef(null); // Create a ref for the messages container
  
  // Fetch chat messages for this session
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/chatbot-services/listMessages/${sessionId}`);
      setMessages(response.data); // Set messages in state
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  // Send a new message to the session
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Avoid sending empty messages
    setSending(true);
    try {
      const response = await axiosInstance.post(
        `/chatbot-services/chat/${sessionId}`, 
        null, // No request body since query is passed as a query parameter
        {
          params: { query: newMessage }, // Pass the message as a query parameter
        }
      );

      // Update messages with the user's message and the bot's response
      setMessages((prev) => [
        ...prev,
        { role: "user", content: newMessage },
        { role: "system", content: response.data.content },
      ]);
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setSending(false);
  };

  // Delete a message
  const deleteMessage = async (sessionId) => {
    try {
      await axiosInstance.delete(`/chatbot-services/deleteSession/${sessionId}`);
      toast({
        title: "Session deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await navigate('/service/chat')
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    // Scroll to the bottom when messages change or when the component mounts
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dependency array is `messages` so it runs whenever messages change

  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, [sessionId]);

  return (
    <Box p={4} height="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Flex align="center" mb={4}>
        <Button colorScheme="teal" size="sm" onClick={() => navigate("/service/chat")}>
          Back
        </Button>
        <Text fontSize="2xl" fontWeight="bold" ml={4}>
          Chat Session: {sessionId}
        </Text>
        <Button
          size="sm"
          bg="red"
          _hover='gray'
          onClick={() => deleteMessage(sessionId)}
          ml="auto" // This pushes the button to the right
        >
          Delete
        </Button>
      </Flex>
      {/* Chat Messages */}
      <Box
        flex="1"
        overflowY="auto"
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        mb={4}
        bg="gray.50"
      >
        {loading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <Box
                  key={msg.id || index}
                  alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                  bg={msg.role === "user" ? "brand.200" : "green.100"}
                  color="gray.800"
                  px={4}
                  py={2}
                  borderRadius="md"
                  boxShadow="md"
                  maxWidth="80%"
                >
                  <Text fontWeight="bold">{msg.role === "user" ? "You" : "Lover"}</Text>
                  <Text>{renderMarkdownResponse(msg.content)}</Text>
                </Box>
              ))
            ) : (
              <Text>No messages yet. Start the conversation!</Text>
            )}
            <div ref={messagesEndRef} /> {/* Add a div with ref to scroll to it */}
          </VStack>
        )}
      </Box>

      {/* Message Input */}
      <HStack spacing={2}>
        <Input
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key
          isDisabled={sending}
        />
        <Button colorScheme="blue" onClick={sendMessage} isLoading={sending}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatDetail;
