import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import {
  Box,
  Button,
  Flex,
  Input,
  List,
  ListItem,
  Text,
  Spinner,
  useToast,
  Container,
} from "@chakra-ui/react";
import { LeftNav } from "../navbar/LeftNav";


const Chat = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

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

  const createSession = async () => {
    if (!newSessionName) {
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

      toast({
        title: "Session created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewSessionName("");
      await navigate(`/service/chat/${response.data.session_id}`);
      fetchSessions(); // Refresh sessions
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

  const goToSession = (sessionId) => {
    navigate(`/service/chat/${sessionId}`);
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex h="100vh">
      <Box w="15%">
        <LeftNav />
      </Box>
      <Container mt={9} w="55%" bg="white" justify="center" align="center">
        <Box p={4} >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="bold" fontSize="xl">
              Chat Sessions
            </Text>
          </Flex>

          {/* Add New Session */}
          <Flex mb={4}>
            <Input
              placeholder="Enter session name"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              bg="brand.50"
              mr={2}
            />
            <Button colorScheme="blue" onClick={createSession}>
              Add
            </Button>
          </Flex>

          {/* Loading Spinner */}
          {loading ? (
            <Flex justify="center">
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color="brand.400" size="xl" />
            </Flex>
          ) : (
            // List of Sessions
            <List spacing={3}>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <ListItem
                    key={session.session_id}
                    p={3}
                    boxShadow="md"
                    borderRadius="md"
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    onClick={() => goToSession(session.session_id)}
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold">{session.session_name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Created: {new Date(session.create_at).toLocaleString()}
                      </Text>
                    </Flex>
                  </ListItem>
                ))
              ) : (
                <Text>No sessions available. Add one to get started!</Text>
              )}
            </List>
          )}
        </Box>
      </Container>
    </Flex>
  );
};

export default Chat;
