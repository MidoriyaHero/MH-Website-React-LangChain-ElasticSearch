import React from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Card,
  CardBody,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { LeftNav } from '../navbar/LeftNav';
import axiosInstance from '../../services/axios';

const Settings = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      user_name: user?.user_name || '',
      email: user?.email || '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '')
      );

      if (errors.user_name || errors.email || errors.password) {
        toast({
          title: 'Validation Error',
          description: 'Please check your input fields',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await axiosInstance.put('/user/update', updateData);
      
      setUser(response.data);
      
      toast({
        title: 'Profile Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response);
      
      toast({
        title: 'Update Failed',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex>
      <Box w="15%">
        <LeftNav />
      </Box>
      <Box flex="1" p={8}>
        <Card maxW="800px" mx="auto" mt={8}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color="brand.700">Account Settings</Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={errors.user_name}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      {...register('user_name', {
                        minLength: { value: 3, message: 'Minimum length is 3 characters' }
                      })}
                    />
                    {errors.user_name && (
                      <FormErrorMessage>{errors.user_name.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>New Password (optional)</FormLabel>
                    <Input
                      type="password"
                      {...register('password', {
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                    {errors.password && (
                      <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="100%"
                  >
                    Save Changes
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default Settings; 