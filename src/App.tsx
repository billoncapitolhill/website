import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { BillDetailsPage } from './pages/BillDetailsPage.tsx';
import { AmendmentDetailsPage } from './pages/AmendmentDetailsPage.tsx';
import { Layout } from './components/Layout.tsx';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bills/:congress/:type/:number" element={<BillDetailsPage />} />
              <Route path="/amendments/:congress/:type/:number" element={<AmendmentDetailsPage />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
