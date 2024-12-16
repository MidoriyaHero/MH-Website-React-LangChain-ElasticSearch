import { extendTheme } from '@chakra-ui/react';

const Theme = extendTheme({
  colors: {
    brand: {
      50: '#f2f9e9', // Lightest
      100: '#dff0c2',
      200: '#cae79b',
      300: '#b6dd74',
      400: '#a1dc6e', // Main Brand Color
      500: '#88bf5c',
      600: '#6c9a47',
      700: '#507531',
      800: '#344f1b',
      900: '#1a2a0d', // Darkest
    },
    complementary: {
      red: '#FF0000',
      yellow: '#FFF8D6', // Optimistic yellow
      pink: '#FADCD9',   // Soft peach/pink for calm
      blue: '#B3E5FC',   // Soothing blue for trust
      lavender: '#E6E6FA', // Relaxing lavender
      mint: '#D4F4DD',    // Fresh, clean mint
      coral: '#FFA07A',   // Vibrant coral for accents
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: {
          bg: 'brand.400', // Default background color for buttons
          color: 'white',
          _hover: {
            bg: 'brand.500',
          },
        },
        outline: {
          borderColor: 'brand.400',
          color: 'brand.400',
          _hover: {
            bg: 'brand.50',
          },
        },
        calming: {
          bg: 'complementary.lavender',
          color: 'black',
          _hover: {
            bg: 'brand.200',
          },
        },
      },
    },
    MenuItem: {
      baseStyle: {
        color: 'brand.400',
        _hover: {
          bg: 'complementary.yellow',
        },
      },
    },
  },
});

export default Theme;
