import { useState } from 'react';
import { Box, Grid, Heading, Text, VStack, Button, Alert, AlertIcon, AlertTitle, AlertDescription, List, ListItem, ListIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Center, Link, HStack, Table, Thead, Tbody, Tr, Th, Td, ButtonGroup } from '@chakra-ui/react';
import { MdCheckCircle, MdGridView, MdList } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';
import type { AISummary } from '../api/client';
import { Tweet } from 'react-tweet';

export function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recent-summaries'],
    queryFn: () => billsApi.getRecentSummaries(20),
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        <Header />
        <Text>Loading latest updates...</Text>
      </VStack>
    );
  }

  if (isError) {
    return (
      <VStack spacing={4} align="stretch">
        <Header />
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
        <Header />
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
      <Header />
      
      <Box bg="green.200" p={4} textAlign="center">
        <Link 
          href="https://pump.fun/coin/AcWWoJCFLVxiHCnSBhB1Paz6ZLr4PbeorodEFe5Ypump" 
          isExternal 
          fontWeight="bold"
          color="green.800"
          _hover={{ textDecoration: 'none', color: 'green.900' }}
        >
          Buy on Pumpfun
        </Link>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} p={4}>
        <Box>
          <Text fontWeight="bold" mb={2}>The Inspiration for the name</Text>
          <Box as="iframe"
            src="https://www.youtube.com/embed/SZ8psP4S6BQ"
            width="100%"
            height="315"
            allowFullScreen
            borderRadius="md"
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>The inspiration for the project</Text>
          <Tweet id="1869865296376303763" />
        </Box>
      </Grid>

      <HStack justifyContent="space-between" px={4}>
        <Heading size="lg">Recent Bills and Amendments</Heading>
        <ButtonGroup size="sm" isAttached>
          <Button
            leftIcon={<MdGridView />}
            onClick={() => setViewMode('grid')}
            colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
          >
            Grid
          </Button>
          <Button
            leftIcon={<MdList />}
            onClick={() => setViewMode('table')}
            colorScheme={viewMode === 'table' ? 'blue' : 'gray'}
          >
            Table
          </Button>
        </ButtonGroup>
      </HStack>

      {viewMode === 'grid' ? (
        <Grid templateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={6} p={4}>
          {response.map((summary: AISummary) => {
            const { bill } = summary;
            if (!bill) return null;
            const path = `/bills/${bill.congress_number}/${bill.bill_type}/${bill.bill_number}`;
            return <BillCard key={summary.id} summary={summary} path={path} />;
          })}
        </Grid>
      ) : (
        <Box overflowX="auto" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Bill</Th>
                <Th>Title</Th>
                <Th>Latest Action</Th>
                <Th>Updated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {response.map((summary: AISummary) => {
                const { bill } = summary;
                if (!bill) return null;
                const path = `/bills/${bill.congress_number}/${bill.bill_type}/${bill.bill_number}`;
                return (
                  <Tr key={summary.id}>
                    <Td>
                      <Link as={RouterLink} to={path} color="blue.600">
                        {bill.bill_type} {bill.bill_number}
                      </Link>
                    </Td>
                    <Td>{bill.title}</Td>
                    <Td>{bill.latest_action_text}</Td>
                    <Td>{format(new Date(summary.updated_at), 'MMM d, yyyy')}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  );
}

function Header() {
  return (
    <Center py={8} borderBottom="1px" borderColor="gray.200">
      <Heading size="2xl" bgGradient="linear(to-r, blue.500, green.500)" bgClip="text">
        $BILL On Capitol Hill
      </Heading>
    </Center>
  );
}

function BillCard({ summary, path }: { summary: AISummary; path: string }) {
  const { bill } = summary;
  return (
    <Box
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
        
        <Text fontSize="sm" color="gray.600">
          Latest Action ({format(new Date(bill.latest_action_date), 'MMM d, yyyy')}):
          <Text as="span" fontWeight="medium"> {bill.latest_action_text}</Text>
        </Text>

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
}