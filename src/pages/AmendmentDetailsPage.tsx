import { Box, Heading, Text, VStack, Badge, SimpleGrid, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';

export function AmendmentDetailsPage() {
  const { congress, type, number } = useParams<{ congress: string; type: string; number: string }>();

  const { data: amendment, isLoading } = useQuery({
    queryKey: ['amendment', congress, type, number],
    queryFn: () => billsApi.getAmendment(Number(congress), type!, Number(number)),
    enabled: !!congress && !!type && !!number,
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading>Loading amendment details...</Heading>
      </VStack>
    );
  }

  if (!amendment) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading>Amendment not found</Heading>
        <Button as={RouterLink} to="/" colorScheme="blue">
          Return to Home
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Badge colorScheme="purple" mb={2}>{amendment.amendment_type}-{amendment.amendment_number}</Badge>
        <Heading size="xl" mb={2}>Amendment to Bill {amendment.bill_id}</Heading>
        <Text color="gray.600">
          Submitted on {format(new Date(amendment.submitted_date), 'MMMM d, yyyy')}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Heading size="md" mb={4}>Amendment Information</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontWeight="bold">Chamber</Text>
              <Text>{amendment.chamber}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Purpose</Text>
              <Text>{amendment.purpose}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Latest Action</Text>
              <Text>{amendment.latest_action_text}</Text>
              <Text fontSize="sm" color="gray.600">
                {format(new Date(amendment.latest_action_date), 'MMMM d, yyyy')}
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={4}>AI Analysis</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontWeight="bold">Summary</Text>
              <Text>{amendment.ai_summary.summary}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Analysis</Text>
              <Text>{amendment.ai_summary.analysis}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Sentiment</Text>
              <Badge colorScheme={amendment.ai_summary.sentiment > 0 ? 'green' : amendment.ai_summary.sentiment < 0 ? 'red' : 'gray'}>
                {amendment.ai_summary.sentiment > 0 ? 'Positive' : amendment.ai_summary.sentiment < 0 ? 'Negative' : 'Neutral'}
              </Badge>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box>
        <Button as={RouterLink} to="/" colorScheme="blue" mr={4}>
          Back to Home
        </Button>
        <Button
          as={RouterLink}
          to={`/bills/${amendment.congress_number}/${amendment.bill_id.split('/')[1]}/${amendment.bill_id.split('/')[2]}`}
          colorScheme="purple"
        >
          View Original Bill
        </Button>
      </Box>
    </VStack>
  );
} 