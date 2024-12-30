import { Box, Container, Flex, Heading, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4} mb={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Heading size="lg" color="blue.600">Bill on Capitol Hill</Heading>
            </ChakraLink>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" pb={8}>
        {children}
      </Container>
    </Box>
  );
} 