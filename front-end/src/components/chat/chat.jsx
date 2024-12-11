import React, { useState } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { LeftNav } from '../navbar/LeftNav';
import  ChatSessionList  from './ChatSessionList'
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedSession, setSelectedSession] = useState(null); // Selected chat session

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const botMessage = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = await response.text();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Oops! Something went wrong." },
        ]);
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Unable to connect to the server." },
      ]);
      console.error("Error:", error);
    }
  
    setInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const fetchMessagesForSession = async (sessionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        console.error("Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSession(sessionId);
    fetchMessagesForSession(sessionId);
  };

  return (
    <Flex h="100vh">
      {/* Left Navbar */}
      <Box w="15%">
        <LeftNav />
      </Box>

      {/* Chat Session List */}
      <Box w="15%" bg="gray.50" p={4} overflowY="auto">
        <ChatSessionList onSelectSession={handleSessionSelect} />
      </Box>
      
      {/* Chat Interface */}
      <Flex w="55%" bg="white" justify="center" align="center">
      {/* Chat Messages Section */}
      <Flex
          direction="column"
          w="100%"
          h="100%"
          bg="green.50"
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
      <Box
        flex="1"
        bg="brand.50"
        borderRadius="md"
        boxShadow="md"
        p={4}
        overflowY="auto"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <VStack align="stretch" spacing={4}>
          {messages.map((msg, idx) => (
            <Flex
              key={idx}
              justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                bg={msg.sender === "user" ? "brand.500" : "gray.200"}
                color={msg.sender === "user" ? "white" : "black"}
                px={4}
                py={2}
                borderRadius="lg"
                maxW="75%"
                boxShadow="sm"
              >
                <Text fontSize='md'>{msg.text}</Text>
              </Box>
              
            </Flex>
          ))}
        </VStack>
      </Box>

      <Divider my={4} borderColor="brand.300" />

      {/* Message Input Section */}
      <HStack spacing={4}>
      <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add this to listen for "Enter" key
          placeholder="Type your message..."
          flex="1"
          bg="white"
          borderRadius="md"
          boxShadow="sm"
        />
        <Button
          colorScheme="brand"
          onClick={handleSendMessage}
          borderRadius="md"
          isDisabled={!selectedSession} 
        >
          Send
        </Button>
      </HStack>
      </Flex>
    </Flex>
  </Flex>
  );
};

export default Chat;
