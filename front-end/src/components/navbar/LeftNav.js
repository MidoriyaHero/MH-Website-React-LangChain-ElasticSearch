import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

export const LeftNav = () => {
  return (
    <Sidebar backgroundColor="brand.200" >
      <Box w="100%" h='auto' bg="brand.50" p={4}>
        <Flex direction="column"
        align="center"
        justify="center"
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        textAlign="center">
          <Heading mb={4} color='brand.500' >
            Hi user
          </Heading>
        </Flex>
      </Box>
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0)
              return {
                backgroundColor: active ? '#eecef9' : undefined,
              };
          },
        }}
      >
        <MenuItem  component={<Link to="/"/>}>
          Home
        </MenuItem>
        <SubMenu  label="Chat">
          <MenuItem >Chat 1</MenuItem>
          <MenuItem >Chat 2</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/" />}>Daily Journal</MenuItem>
      </Menu>

      <Menu>
        <MenuItem onClick={() => console.log('Logout clicked')} style={{
          color: 'red',
          marginTop: '100%'
          }}
          component={<Link to="/" />}
>
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
