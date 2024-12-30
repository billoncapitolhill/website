import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <VStack spacing={4} align="stretch">
            <Heading>Something went wrong</Heading>
            <Text>We're having trouble loading this content. Please try again later.</Text>
            {this.state.error?.message && (
              <Text color="gray.600" fontSize="sm">
                Error details: {this.state.error.message}
              </Text>
            )}
            <Button
              colorScheme="blue"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
} 