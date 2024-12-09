import React, { useState } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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

  return (
    
    <Flex direction="column" h="100vh" w="100vw" bg="gray.50" p={4}>
      <Box flex="1" bg="white" borderRadius="md" boxShadow="sm" overflowY="auto" p={4}>
        <VStack align="stretch" spacing={4}>
          {messages.map((msg, idx) => (
            <Flex key={idx} align={msg.sender === "user" ? "flex-end" : "flex-start"}>
              <Box
                bg={msg.sender === "user" ? "blue.500" : "gray.300"}
                color={msg.sender === "user" ? "white" : "black"}
                px={4}
                py={2}
                borderRadius="md"
                maxW="70%"
              >
                <Text>{msg.text}</Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      <HStack mt={4}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          flex="1"
        />
        <Button colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default Chat;
