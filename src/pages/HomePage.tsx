import { Box, Grid, Heading, Text, VStack, Button, Alert, AlertIcon, AlertTitle, AlertDescription, List, ListItem, ListIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';
import type { AISummary } from '../api/client';

export function HomePage() {
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recent-summaries'],
    queryFn: () => billsApi.getRecentSummaries(20),
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
        <Text>Loading latest updates...</Text>
      </VStack>
    );
  }

  if (isError) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="lg" p={6}>
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Unable to Load Data
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            We're having trouble connecting to our servers. Please try again later.
            {error instanceof Error && (
              <Text fontSize="sm" color="red.600" mt={2}>
                Error: {error.message}
              </Text>
            )}
          </AlertDescription>
          <Button onClick={() => refetch()} colorScheme="red" size="sm" mt={4}>
            Try Again
          </Button>
        </Alert>
      </VStack>
    );
  }

  if (!response || response.length === 0) {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
        <Alert status="info" variant="subtle" borderRadius="lg">
          <AlertIcon />
          <AlertTitle>No Updates Available</AlertTitle>
          <AlertDescription>
            There are no recent updates to display at this time.
          </AlertDescription>
        </Alert>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="xl" mb={6}>Recent Bills and Amendments</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={6}>
        {response.map((summary: AISummary) => {
          const { bill } = summary;

          if (!bill) {
            return null;
          }

          const path = `/bills/${bill.congress_number}/${bill.bill_type}/${bill.bill_number}`;

          return (
            <Box
              key={summary.id}
              p={6}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              shadow="sm"
            >
              <VStack align="stretch" spacing={4}>
                <Box as={RouterLink} to={path} _hover={{ textDecoration: 'none' }}>
                  <Heading size="md" color="blue.600" mb={2}>
                    {bill.bill_type} {bill.bill_number}: {bill.title}
                  </Heading>
                </Box>
                
                {bill && (
                  <Text fontSize="sm" color="gray.600">
                    Latest Action ({format(new Date(bill.latest_action_date), 'MMM d, yyyy')}):
                    <Text as="span" fontWeight="medium"> {bill.latest_action_text}</Text>
                  </Text>
                )}

                <Text noOfLines={3}>{summary.summary}</Text>

                {summary.key_points && summary.key_points.length > 0 && (
                  <List spacing={2}>
                    {summary.key_points.map((point, index) => (
                      <ListItem key={index} display="flex">
                        <ListIcon as={MdCheckCircle} color="green.500" mt={1} />
                        <Text>{point}</Text>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Accordion allowMultiple>
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Cost Impact
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {summary.estimated_cost_impact}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Government Growth Analysis
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {summary.government_growth_analysis}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Market Impact
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {summary.market_impact_analysis}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Liberty Impact
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {summary.liberty_impact_analysis}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>

                <Text fontSize="sm" color="gray.500" mt={2}>
                  Updated {format(new Date(summary.updated_at), 'MMM d, yyyy')}
                </Text>
              </VStack>
            </Box>
          );
        })}
      </Grid>
    </VStack>
  );
} 