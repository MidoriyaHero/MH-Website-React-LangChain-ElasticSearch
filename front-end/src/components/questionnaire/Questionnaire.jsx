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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { LeftNav } from '../navbar/LeftNav';


const Questionnaire = () => {
  const [gad7Questions, setGad7Questions] = useState([]);
  const [phq9Questions, setPhq9Questions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const toast = useToast();
  const { handleSubmit: handleGad7Submit, control: gad7Control, reset: resetGad7 } = useForm();
  const { handleSubmit: handlePhq9Submit, control: phq9Control, reset: resetPhq9 } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [gad7Response, phq9Response] = await Promise.all([
          axiosInstance.get('/questionnaire/questionnaire/gad7/questions'),
          axiosInstance.get('/questionnaire/questionnaire/phq9/questions')
        ]);
        setGad7Questions(gad7Response.data);
        setPhq9Questions(phq9Response.data);
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

  const onGad7Submit = async (data) => {
    const responses = Object.values(data).map(Number);
    try {
      const response = await axiosInstance.post('/questionnaire/questionnaire/gad7/submit', { responses });
      toast({
        title: 'Đánh giá thành công',
        description: `Tổng điểm của bạn là ${response.data.total_score} (${response.data.severity})`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      resetGad7();
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Đánh giá thất bại',
        description: error.response?.data?.detail || "Vui lòng thử lại",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onPhq9Submit = async (data) => {
    const responses = Object.values(data).map(Number);
    try {
      const response = await axiosInstance.post('/questionnaire/questionnaire/phq9/submit', { responses });
      toast({
        title: 'Đánh giá thành công',
        description: `Tổng điểm của bạn là ${response.data.total_score} (${response.data.severity})`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      resetPhq9();
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Đánh giá thất bại',
        description: error.response?.data?.detail || "Vui lòng thử lại",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getSeverityColor = (severity) => {
    if (severity.includes('nhẹ')) return 'yellow';
    if (severity.includes('vừa') || severity.includes('trung bình')) return 'orange';
    if (severity.includes('nặng')) return 'red';
    return 'green';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
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
    <Flex>
      <Box w="15%">
        <LeftNav />
      </Box>

      <Box w="50%" p={6}>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>GAD-7 (Lo âu)</Tab>
            <Tab>PHQ-9 (Trầm cảm)</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading mb={6} color="brand.700" size="lg">Đánh giá mức độ lo âu (GAD-7)</Heading>
              <form onSubmit={handleGad7Submit(onGad7Submit)}>
                <Stack spacing={8}>
                  {gad7Questions.map((question, index) => (
                    <FormControl key={index} isRequired>
                      <FormLabel mb={4} color="brand.600">
                        {index + 1}. {question}
                      </FormLabel>
                      <Controller
                        name={`response_${index}`}
                        control={gad7Control}
                        defaultValue=""
                        rules={{ required: "Câu hỏi này là bắt buộc" }}
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <Stack direction="row" spacing={4}>
                              <Radio value="0">Không có</Radio>
                              <Radio value="1">Vài ngày</Radio>
                              <Radio value="2">Hơn nửa số ngày</Radio>
                              <Radio value="3">Gần như mỗi ngày</Radio>
                            </Stack>
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  ))}
                </Stack>
                <Button mt={10} colorScheme="brand" type="submit" width="100%">
                  Hoàn thành
                </Button>
              </form>
            </TabPanel>

            <TabPanel>
              <Heading mb={6} color="brand.700" size="lg">Đánh giá mức độ trầm cảm (PHQ-9)</Heading>
              <form onSubmit={handlePhq9Submit(onPhq9Submit)}>
                <Stack spacing={8}>
                  {phq9Questions.map((question, index) => (
                    <FormControl key={index} isRequired>
                      <FormLabel mb={4} color="brand.600">
                        {index + 1}. {question}
                      </FormLabel>
                      <Controller
                        name={`response_${index}`}
                        control={phq9Control}
                        defaultValue=""
                        rules={{ required: "Câu hỏi này là bắt buộc" }}
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <Stack direction="row" spacing={4}>
                              <Radio value="0">Không có</Radio>
                              <Radio value="1">Vài ngày</Radio>
                              <Radio value="2">Hơn nửa số ngày</Radio>
                              <Radio value="3">Gần như mỗi ngày</Radio>
                            </Stack>
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  ))}
                </Stack>
                <Button mt={10} colorScheme="brand" type="submit" width="100%">
                  Hoàn thành
                </Button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box w="40%" p={6}>
        <Heading size="md" mb={4} color="brand.600">Lịch sử đánh giá</Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Ngày</Th>
                <Th>Loại</Th>
                <Th>Điểm</Th>
                <Th>Mức độ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((result) => (
                <Tr key={result.response_id}>
                  <Td>{formatDate(result.timestamp)}</Td>
                  <Td>{result.questionnaire_type}</Td>
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