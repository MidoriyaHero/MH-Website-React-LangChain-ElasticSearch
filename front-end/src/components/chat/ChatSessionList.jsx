import React, { useEffect, useState } from "react";
import { VStack, Button, Text } from "@chakra-ui/react";

const ChatSession = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/chat/sessions");
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions);
        } else {
          console.error("Failed to fetch chat sessions.");
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <VStack align="stretch" spacing={4}>
      {sessions.map((session) => (
        <Button
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          variant="outline"
          colorScheme="brand"
          justifyContent="start"
        >
          <Text>{session.name || `Session ${session.id}`}</Text>
        </Button>
      ))}
    </VStack>
  );
};

export default ChatSession;
