import { IconButton, useColorMode, Tooltip, Flex } from '@chakra-ui/react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export const ThemeToggle = ({ showTooltip = true, size = 'md', ...rest }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  const button = (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={colorMode === 'light' ? <MdDarkMode /> : <MdLightMode />}
      onClick={toggleColorMode}
      variant="ghost"
      size={size}
      color={colorMode === 'light' ? 'gray.600' : 'yellow.400'}
      _hover={{
        bg: colorMode === 'light' ? 'gray.100' : 'gray.700',
      }}
      {...rest}
    />
  );

  return (
    <Flex align="center" justify="center">
      {showTooltip ? (
        <Tooltip
          label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
          placement="bottom"
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </Flex>
  );
};
