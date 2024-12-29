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
            <Heading textColor='brand.700' mb={6}>Login</Heading>
            <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                <FormControl isInvalid={errors.email} mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                    placeholder='Enter your email'
                    type='email'
                    {...register('email', {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                        },
                    })}
                    />
                    <FormErrorMessage>
                        {errors.email && errors.email.message}
                    </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.password} mb={6}>
                    <FormLabel>Password</FormLabel>
                    <Input
                    placeholder='Enter your password'
                    type='password'
                    {...register('password', {
                        required: "Password is required",
                        minLength: {
                            value: 5,
                            message: "Password must be at least 5 characters",
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
                    Login
                </Button>
            </form>

            <Button 
            onClick={()=> navigate('/register', {replace:true})} 
            colorScheme='brand' variant='link' mb={2}>
                Or Signup
            </Button>
            <Button
          leftIcon={<FiHome />}
          justifyContent='flex-end'
          bg="brand.400"
          color="white"
          _hover={{ bg: "brand.500" }}
          onClick={() => navigate('/')}
        >Back to Home</Button>
        </Flex>
        </Flex>
}