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
  useColorMode,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { LeftNav } from '../navbar/LeftNav';
import { FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';


const Questionnaire = () => {
  const [gad7Questions, setGad7Questions] = useState([]);
  const [phq9Questions, setPhq9Questions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const toast = useToast();
  const { handleSubmit: handleGad7Submit, control: gad7Control, reset: resetGad7 } = useForm();
  const { handleSubmit: handlePhq9Submit, control: phq9Control, reset: resetPhq9 } = useForm();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const cancelRef = React.useRef();

  const questionStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
    color: colorMode === 'light' ? 'gray.700' : 'gray.100',
  };

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
      if (response.data.total_score > 14) {
        setWarningMessage(`Điểm của bạn là ${response.data.total_score}, mức độ ${response.data.severity}. Vui lòng xem xét việc gặp chuyên gia.`);
        setIsWarningOpen(true);
      }

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
      if (response.data.total_score > 14) {
        setWarningMessage(`Điểm của bạn là ${response.data.total_score}, mức độ ${response.data.severity}. Vui lòng xem xét việc gặp chuyên gia.`);
        setIsWarningOpen(true);
      }

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

  const handleDelete = async (responseId) => {
    try {
      await axiosInstance.delete(`/questionnaire/questionnaire/response/${responseId}`);
      toast({
        title: 'Xóa thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Xóa thất bại',
        description: error.response?.data?.detail || "Vui lòng thử lại",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
      <Box w="20%">
        <LeftNav />
      </Box>

      <Box w="45%" p={6}>
        <Tabs 
          isFitted 
          variant="soft-rounded" 
          colorScheme="brand"
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          p={4}
          borderRadius="xl"
          boxShadow="sm"
        >
          <TabList mb="1em">
            <Tab _selected={{ bg: 'brand.500', color: 'white' }}>GAD-7 (Lo âu)</Tab>
            <Tab _selected={{ bg: 'brand.500', color: 'white' }}>PHQ-9 (Trầm cảm)</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading mb={6} color="brand.700" size="lg">Đánh giá mức độ lo âu (GAD-7)</Heading>
              <form onSubmit={handleGad7Submit(onGad7Submit)}>
                <Stack spacing={8}>
                  {gad7Questions.map((question, index) => (
                    <FormControl 
                      key={index} 
                      isRequired
                      as={motion.div}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormLabel 
                        mb={4} 
                        sx={questionStyle}
                      >
                        {index + 1}. {question}
                      </FormLabel>
                      <Controller
                        name={`response_${index}`}
                        control={gad7Control}
                        defaultValue=""
                        rules={{ required: "Câu hỏi này là bắt buộc" }}
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <Stack 
                              direction={{ base: "column", md: "row" }} 
                              spacing={4}
                              mt={2}
                            >
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
                    <FormControl 
                      key={index} 
                      isRequired
                      as={motion.div}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormLabel 
                        mb={4} 
                        sx={questionStyle}
                      >
                        {index + 1}. {question}
                      </FormLabel>
                      <Controller
                        name={`response_${index}`}
                        control={phq9Control}
                        defaultValue=""
                        rules={{ required: "Câu hỏi này là bắt buộc" }}
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <Stack 
                              direction={{ base: "column", md: "row" }} 
                              spacing={4}
                              mt={2}
                            >
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

      <Box 
        w="40%" 
        p={6}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="xl"
        boxShadow="sm"
        ml={4}
      >
        <Heading size="md" mb={4} color="brand.600">Lịch sử đánh giá</Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Ngày</Th>
                <Th>Loại</Th>
                <Th>Điểm</Th>
                <Th>Mức độ</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((result) => (
                <Tr 
                  key={result.response_id}
                  _hover={{ bg: colorMode === 'light' ? 'gray.50' : 'gray.700' }}
                >
                  <Td>{formatDate(result.timestamp)}</Td>
                  <Td>{result.questionnaire_type}</Td>
                  <Td>
                    <Badge colorScheme="purple" variant="subtle">
                      {result.total_score}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={getSeverityColor(result.severity)}
                      p={2}
                      borderRadius="full"
                      variant="solid"
                    >
                      {result.severity}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(result.response_id)}
                      icon={<FiTrash2 />}
                      aria-label="Delete result"
                    >
                      <FiTrash2 />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <AlertDialog
        isOpen={isWarningOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsWarningOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cảnh báo
            </AlertDialogHeader>
            <AlertDialogBody>
              {warningMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsWarningOpen(false)}>
                Đóng
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default Questionnaire; 