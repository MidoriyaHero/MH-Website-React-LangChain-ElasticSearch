import React, {useState}  from 'react';
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
  Divider,
  Text,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { LeftNav } from '../navbar/LeftNav';
import axiosInstance from '../../services/axios';
import { HamburgerIcon } from '@chakra-ui/icons';

const Settings = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      user_name: user?.user_name || '',
      email: user?.email || '',
      password: '',
      emergency_contact_email: user?.emergency_contact_email || '',
    }
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const onSubmit = async (data) => {
    try {
      const updateData = {};
      
      // Only include fields that have changed
      if (data.user_name !== user?.user_name && data.user_name) {
        updateData.user_name = data.user_name;
      }
      if (data.email !== user?.email && data.email) {
        updateData.email = data.email;
      }
      if (data.password) {
        updateData.password = data.password;
      }
      if (data.emergency_contact_email !== user?.emergency_contact_email) {
        updateData.emergency_contact_email = data.emergency_contact_email;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        const response = await axiosInstance.put('/user/update', updateData);
        setUser(response.data);
        
        toast({
          title: 'Profile Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Cập nhật thất bại',
        description: error.response?.data?.detail || 'Có lỗi xảy ra',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction={isMobile ? "column" : "row"}>
      {isMobile && (
        <IconButton
          icon={<HamburgerIcon />}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          onClick={() => setIsNavOpen(true)}
          aria-label="Open navigation"
        />
      )}

      {isMobile ? (
        <Drawer isOpen={isNavOpen} placement="left" onClose={() => setIsNavOpen(false)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody p={0}>
              <LeftNav isDrawer={true} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Box w="15%">
          <LeftNav />
        </Box>
      )}

      <Box 
        flex="1" 
        p={{ base: 4, md: 8 }}
        mt={isMobile ? 12 : 0}
      >
        <Card 
          maxW={{ base: "100%", md: "800px" }} 
          mx="auto" 
          mt={{ base: 2, md: 8 }}
        >
          <CardBody p={{ base: 4, md: 6 }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              <Heading size={{ base: "md", md: "lg" }} mb={{ base: 4, md: 6 }}>
                Cài đặt tài khoản
              </Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={errors.user_name}>
                    <FormLabel>Tên người dùng</FormLabel>
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
                          message: 'Email không đúng định dạng'
                        }
                      })}
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input
                      placeholder="Nhập mật khẩu mới"
                      type="password"
                      {...register('password', {
                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                      })}
                    />
                    {errors.password && (
                      <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Divider my={4} />
                  
                  <Text fontSize="lg" fontWeight="medium" color="brand.700">
                  Email người thân nhất của bạn
                  </Text>
                  
                  <FormControl isInvalid={errors.emergency_contact_email}>
                    <FormLabel>khi bạn có vấn đề về sức khỏe nghiêm trọng được ghi trong nhật ký, chúng tôi sẽ gửi email đến người này!</FormLabel>
                    <Input
                    
                      {...register('emergency_contact_email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      defaultValue={user?.emergency_contact_email || ""}
                    />
                    {user?.emergency_contact_email && (
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        Email đang dùng hiện tại: {user.emergency_contact_email}
                      </Text>
                    )}
                    {errors.emergency_contact_email && (
                      <FormErrorMessage>{errors.emergency_contact_email.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size={{ base: "md", md: "lg" }}
                    w="100%"
                    mt={4}
                  >
                    Lưu thay đổi
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