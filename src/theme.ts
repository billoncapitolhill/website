import { theme as baseTheme } from '@chakra-ui/theme';
import { extendTheme } from '@chakra-ui/theme-utils';

export const theme = extendTheme(
  {
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    styles: {
      global: {
        body: {
          bg: 'gray.50',
        },
      },
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'blue',
        },
      },
      Link: {
        baseStyle: {
          _hover: {
            textDecoration: 'none',
          },
        },
      },
    },
  },
  baseTheme
); 