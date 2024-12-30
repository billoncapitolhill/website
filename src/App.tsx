import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BillDetailsPage } from './pages/BillDetailsPage';
import { AmendmentDetailsPage } from './pages/AmendmentDetailsPage';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/bills/:congress/:type/:number" element={<BillDetailsPage />} />
                <Route path="/amendments/:congress/:type/:number" element={<AmendmentDetailsPage />} />
              </Routes>
            </Layout>
          </Router>
        </ErrorBoundary>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
