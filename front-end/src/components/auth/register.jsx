import {
    Button,
    Flex, 
    Heading,
    useToast,
    Input} from '@chakra-ui/react';
import {
    FormControl, 
    FormErrorMessage,
} from '@chakra-ui/form-control';
import {useForm} from 'react-hook-form'
import { useNavigate } from "react-router";
import axiosInstance from '../../services/axios';
import { FiHome } from 'react-icons/fi';

export const Register = () => {
    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
    } = useForm();
    const navigate = useNavigate();
    const toast = useToast();
    const onSubmit = async (values) => {
        try {
          await axiosInstance.post('/users/create', values);
          toast(
            {title: "Created Successfully!!!",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          navigate('/login', {replace: true});
        } catch (err) {
          toast({
            title: `${err.response.data.detail}`,
            status: 'error',
            isClosable:true,
            duration: 1500
          })
        }
    }
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          alignItems="center"
          background={('brand.200')}
          p={12}
          rounded={6}
        >
          <Heading textColor='brand' mb={6}>Register</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.email}>
              <Input
                placeholder="Email"
                background={('brand.100')}
                type="email"
                size="lg"
                mt={6}
                {...register("email", {
                  required: "This is required field",
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.username}>
              <Input
                placeholder="username"
                background={('brand.100')}
                type="text"
                variant="filled"
                size="lg"
                mt={6}
                {...register("username", {
                  required: "This filed is required",
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                  maxLength: {
                    value: 24,
                    message: "Username must be at most 24 characters",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <Input
                placeholder="Password"
                background={('brand.100')}
                type="password"
                size="lg"
                mt={6}
                {...register("password", {
                  required: "This is required field",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters long",
                  },
                  maxLength: {
                    value: 24,
                    message: "Password must be at most 24 characters",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              isLoading={isSubmitting}
              loadingText="Creating account..."
              width="100%"
              bg="brand.300"
              _hover={{ bg: "brand.500" }} mt={3} mb={2}
            >
              Signup
            </Button>
          </form>
          <Button
            onClick={() => navigate("/login", { replace: true })}
            width="100%"
            colorScheme='brand' textColor='brand.700' variant='link' mb={2}
          >
            Login Instead
          </Button>
          <Button
          leftIcon={<FiHome />}
          justifyContent='flex-end'
          bg="brand.300"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/')}
        >Back to Home</Button>
        </Flex>
      </Flex>
    );
  };