import {
    Button,
    Flex, 
    Heading,
    Input,
    useToast } from '@chakra-ui/react';
import {
    FormControl, 
    FormErrorMessage,
} from '@chakra-ui/form-control';
import {useForm} from 'react-hook-form'
import { useNavigate } from "react-router";
import { useAuth } from '../../hooks/useAuth';
import { FiHome } from 'react-icons/fi';

export const Login = () => {
    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting,},
    }  = useForm();

    const navigate = useNavigate();
    const {login} = useAuth();
    const toast = useToast();
    const onSubmit = async (values) => {
        try {
            await login(values.email, values.password )
        } catch (err) {
            toast({
                title: 'Invalid Email or Password',
                status: 'error',
                isClosable: true,
                duration: 1500,
            })
        }
    }
    return <Flex height='100vh' align ='center' justifyContent='center'>
        <Flex 
        direction='column' 
        alignItems ='center' 
        background={('brand.200')}
        p={12}
        rounded={6}>
            <Heading textColor='brand' mb={6}>Login</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email}>
                    <Input
                    placeholder='Email'
                    background={('brand.100')}
                    type='email'
                    size='lg'
                    mt={6}
                    {...register('email',{
                        required: "This is required field!!!"
                    })}
                    />
                    <FormErrorMessage>
                        {errors.email && errors.email.message}
                    </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.email}>
                    <Input
                    placeholder='Password'
                    background={('brand.100')}
                    type='password'
                    size='lg'
                    mt={6}
                    {...register('password',{
                        required: "This is required field!!!"
                    })}
                    />
                    <FormErrorMessage>
                        {errors.password && errors.password.message}
                    </FormErrorMessage>
                </FormControl>

                <Button 
                width='100%'
                isLoading={isSubmitting}
                bg="brand.300"
                _hover={{ bg: "brand.500" }}
                mt={3} mb ={0}
                type = 'submit'>
                    Login
                </Button>
            </form>

            <Button 
            onClick={()=> navigate('/signup', {replace:true})} 
            colorScheme='brand' textColor='brand.700' variant='link' mt={3} mb={2}>
                Or Signup
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
}