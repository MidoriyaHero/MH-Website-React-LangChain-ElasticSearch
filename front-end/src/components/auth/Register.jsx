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
          const response = await axiosInstance.post('/user/create-users', values);
          toast(
            {title: "Created Successfully!!!",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
          navigate('/login', {replace: true});
        } catch (err) {
          console.error('Registration error:', err);
          toast({
            title: `${err.response?.data?.detail || 'Registration failed'}`,
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
          <Heading textColor='brand.700' mb={6}>Đăng ký</Heading>
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
                placeholder="Tên người dùng"
                background={('brand.100')}
                type="text"
                variant="filled"
                size="lg"
                mt={6}
                {...register("username", {
                  required: "Bắt buộc nhập tên người dùng",
                  minLength: {
                    value: 5,
                    message: "Tên người dùng phải có ít nhất 5 ký tự",
                  },
                  maxLength: {
                    value: 24,
                    message: "Tên người dùng không được quá 24 ký tự",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <Input
                placeholder="Mật khẩu"
                background={('brand.100')}
                type="password"
                size="lg"
                mt={6}
                {...register("password", {
                  required: "Mật khẩu bắt buộc nhập",
                  minLength: {
                    value: 5,
                    message: "Mật khẩu phải có ít nhất 5 ký tự",
                  },
                  
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              colorScheme='brand'
              isLoading={isSubmitting}
              loadingText="Creating account..."
              width="100%"
              bg="brand.300"
              _hover={{ bg: "brand.500" }} mt={3} mb={2}
            >
              Đăng ký
            </Button>
          </form>
          <Button
            onClick={() => navigate("/login", { replace: true })}
            width="100%"
            colorScheme='brand' textColor='brand.700' variant='link' mb={2}
          >
            Hoặc đăng nhập
          </Button>
          <Button
          leftIcon={<FiHome />}
          justifyContent='flex-end'
          bg="brand.300"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/')}
        >Về trang chủ</Button>
        </Flex>
      </Flex>
    );
  };