import { Box, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';

export function HomePage() {
  const { data: summaries, isLoading } = useQuery({
    queryKey: ['recent-summaries'],
    queryFn: () => billsApi.getRecentSummaries(20),
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
        <Text>Loading...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {summaries?.map((summary) => {
          const isBill = summary.target_type === 'bill';
          const [congress, type, number] = summary.target_id.split('/');
          const path = isBill ? `/bills/${congress}/${type}/${number}` : `/amendments/${congress}/${type}/${number}`;

          return (
            <Box
              key={summary.id}
              as={RouterLink}
              to={path}
              p={6}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="bold" color="blue.600">
                  {isBill ? 'Bill' : 'Amendment'} {type}-{number}
                </Text>
                <Text noOfLines={3}>{summary.summary}</Text>
                <Text fontSize="sm" color="gray.500">
                  Updated {format(new Date(summary.updated_at), 'MMM d, yyyy')}
                </Text>
                <Text fontSize="sm" color={summary.sentiment > 0 ? 'green.500' : summary.sentiment < 0 ? 'red.500' : 'gray.500'}>
                  Sentiment: {summary.sentiment > 0 ? 'Positive' : summary.sentiment < 0 ? 'Negative' : 'Neutral'}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </Grid>
    </VStack>
  );
} 