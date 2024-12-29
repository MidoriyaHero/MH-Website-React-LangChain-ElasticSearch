import { extendTheme } from '@chakra-ui/react';

const Theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f4f8', // Lighter shades for a fresher look
      100: '#d9e2ec',
      200: '#bfd1e5',
      300: '#a6c0dc',
      400: '#8da9d3', // Slightly muted for modern appeal
      500: '#7392c0',
      600: '#5c78a3',
      700: '#435a85',
      800: '#2e3c68',
      900: '#1b214b',
    },
    complementary: {
      red: '#FF6B6B',
      yellow: '#FFE66D',
      pink: '#FF9AA2',
      blue: '#4ECDC4',
      lavender: '#C06C84',
      mint: '#355C7D',
      coral: '#FF847C',
    },
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Roboto, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'outline',
        },
      },
      variants: {
        solid: {
          bg: 'brand.400',
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
          bg: 'brand.200',
          color: 'black',
          _hover: {
            bg: 'complementary.lavender',
          },
        },
        tindeptrai: {
          bg: 'complementary.blue',
          color: 'black',
          _hover: {
            bg: 'complementary.lavender',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'brand.50',
            _hover: {
              bg: 'brand.100',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.400',
            },
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
      },
    },
    Heading: {
      baseStyle: {
        color: 'brand.700',
      },
    },
  },
});

export default Theme;