import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Heading,
  Spinner,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { LeftNav } from '../navbar/LeftNav';


const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const toast = useToast();
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get('/questionnaire/questionnaire/gad7/questions');
        setQuestions(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching questions',
          description: error.response?.data?.detail || "An error occurred",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);
  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get('/questionnaire/questionnaire/history');
      setHistory(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching history',
        description: error.response?.data?.detail || "An error occurred",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);

  const onSubmit = async (data) => {
    const responses = Object.values(data).map(Number);
    try {
      const response = await axiosInstance.post('/questionnaire/questionnaire/gad7/submit', { responses });
      toast({
        title: 'Submission Successful',
        description: `Your total score is ${response.data.total_score} (${response.data.severity})`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      reset();
      navigate('/service/questionnaire');
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.detail || "Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild Anxiety':
        return 'yellow';
      case 'Moderate Anxiety':
        return 'orange';
      case 'Severe Anxiety':
        return 'red';
      default:
        return 'green';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="brand.400" />
      </Flex>
    );
  }

  return (
    <Flex >
    <Box w="15%" >
        <LeftNav />
    </Box>
    
      <Box
        maxW="800px"
        mx="auto"
        p={6}
        bg="white"
        rounded="md"
        shadow="md"
        mt={6}
        w="100%"
      >
        <Heading mb={6} color="brand.700">GAD-7 Questionnaire</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8}>
            {questions.map((question, index) => (
              <FormControl key={index} as="fieldset" isRequired>
                <FormLabel mb={4} color="brand.600">
                  {index + 1}. {question}
                </FormLabel>
                <Controller
                  name={`response_${index}`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "This question is required" }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction="row" spacing={4}>
                        <Radio value="0">Not at all</Radio>
                        <Radio value="1">Several days</Radio>
                        <Radio value="2">More than half the days</Radio>
                        <Radio value="3">Nearly every day</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
              </FormControl>
            ))}
          </Stack>
          <Button
            mt={10}
            colorScheme="brand"
            type="submit"
            width="100%"
          >
            Submit
          </Button>
        </form>

        
        </Box>
        <Box w='35%' mt={10}>
          <Heading size="md" mb={4} color="brand.600">History</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Score</Th>
                  <Th>Severity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history.map((result) => (
                  <Tr key={result.response_id}>
                    <Td>{formatDate(result.timestamp)}</Td>
                    <Td>{result.total_score}</Td>
                    <Td>
                      <Badge 
                        colorScheme={getSeverityColor(result.severity)}
                        p={2}
                        borderRadius="full"
                      >
                        {result.severity}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
    </Flex>
  );
};

export default Questionnaire; 