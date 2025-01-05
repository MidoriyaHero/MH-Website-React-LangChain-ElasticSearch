import {
    Button,
    Flex, 
    Heading,
    Input,
    useToast } from '@chakra-ui/react';
import {
    FormControl, 
    FormErrorMessage,
    FormLabel,
} from '@chakra-ui/form-control';
import {useForm} from 'react-hook-form'
import { useNavigate } from "react-router";
import { useAuth } from '../../hooks/useAuth';
import { FiHome } from 'react-icons/fi';

export const Login = () => {
    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
    }  = useForm();

    const navigate = useNavigate();
    const {login} = useAuth();
    const toast = useToast();
    const onSubmit = async (values) => {
        try {
            await login(values.email, values.password)
            toast({
                title: 'Login Successful',
                status: 'success',
                isClosable: true,
                duration: 2000,
            })
        } catch (err) {
            toast({
                title: 'Invalid Email or Password',
                status: 'error',
                isClosable: true,
                duration: 1500,
            })
        }
    }
    return <Flex height='100vh' align ='center' justifyContent='center' bg="brand.50">
        <Flex 
        direction='column' 
        alignItems ='center' 
        background='white'
        p={12}
        rounded='lg'
        shadow='lg'
        width={{base: '90%', md: '400px'}}>
            <Heading textColor='brand.700' mb={6}>Đăng nhập</Heading>
            <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                <FormControl isInvalid={errors.email} mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                    placeholder='Nhập email của bạn'
                    type='email'
                    {...register('email', {
                        required: "Bắt buộc nhập Email",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email không đúng định dạng",
                        },
                    })}
                    />
                    <FormErrorMessage>
                        {errors.email && errors.email.message}
                    </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.password} mb={6}>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input
                    placeholder='Nhập mật khẩu'
                    type='password'
                    {...register('password', {
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
                width='100%'
                type='submit'
                colorScheme="brand"
                isLoading={isSubmitting}
                mb={4}>
                    Đăng nhập
                </Button>
            </form>

            <Button 
            onClick={()=> navigate('/register', {replace:true})} 
            colorScheme='brand' variant='link' mb={2}>
                Hoặc đăng ký
            </Button>
            <Button
          leftIcon={<FiHome />}
          justifyContent='flex-end'
          bg="brand.400"
          color="white"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/')}
        >Về trang chủ</Button>
        </Flex>
        </Flex>
}