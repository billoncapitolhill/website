import { Box, Heading, Text, VStack, Badge, Divider, SimpleGrid, Link, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';

export function BillDetailsPage() {
  const { congress, type, number } = useParams<{ congress: string; type: string; number: string }>();

  const { data: bill, isLoading } = useQuery({
    queryKey: ['bill', congress, type, number],
    queryFn: () => billsApi.getBill(Number(congress), type!, number!),
    enabled: !!congress && !!type && !!number,
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading>Loading bill details...</Heading>
      </VStack>
    );
  }

  if (!bill) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading>Bill not found</Heading>
        <Button as={RouterLink} to="/" colorScheme="blue">
          Return to Home
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Badge colorScheme="blue" mb={2}>{bill.bill_type}-{bill.bill_number}</Badge>
        <Heading size="xl" mb={2}>{bill.title}</Heading>
        <Text color="gray.600">
          Introduced on {format(new Date(bill.introduced_date), 'MMMM d, yyyy')}
        </Text>
      </Box>

      <Divider />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Heading size="md" mb={4}>Bill Information</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontWeight="bold">Origin Chamber</Text>
              <Text>{bill.origin_chamber}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Latest Action</Text>
              <Text>{bill.latest_action_text}</Text>
              <Text fontSize="sm" color="gray.600">
                {format(new Date(bill.latest_action_date), 'MMMM d, yyyy')}
              </Text>
            </Box>
            {bill.constitutional_authority_text && (
              <Box>
                <Text fontWeight="bold">Constitutional Authority</Text>
                <Text>{bill.constitutional_authority_text}</Text>
              </Box>
            )}
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={4}>AI Analysis</Heading>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontWeight="bold">Summary</Text>
              <Text>{bill.ai_summary.summary}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Analysis</Text>
              <Text>{bill.ai_summary.analysis}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Sentiment</Text>
              <Badge colorScheme={bill.ai_summary.sentiment > 0 ? 'green' : bill.ai_summary.sentiment < 0 ? 'red' : 'gray'}>
                {bill.ai_summary.sentiment > 0 ? 'Positive' : bill.ai_summary.sentiment < 0 ? 'Negative' : 'Neutral'}
              </Badge>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      {bill.amendments.length > 0 && (
        <>
          <Divider />
          <Box>
            <Heading size="md" mb={4}>Amendments</Heading>
            <VStack align="stretch" spacing={4}>
              {bill.amendments.map((amendment) => (
                <Box
                  key={amendment.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Link
                    as={RouterLink}
                    to={`/amendments/${amendment.congress_number}/${amendment.amendment_type}/${amendment.amendment_number}`}
                    color="blue.600"
                    fontWeight="semibold"
                  >
                    Amendment {amendment.amendment_type}-{amendment.amendment_number}
                  </Link>
                  <Text mt={2}>{amendment.description}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Submitted on {format(new Date(amendment.submitted_date), 'MMMM d, yyyy')}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </>
      )}

      <Box>
        <Button as={RouterLink} to="/" colorScheme="blue">
          Back to Home
        </Button>
      </Box>
    </VStack>
  );
} 