import { useState } from 'react';
import { Box, Grid, Heading, Text, VStack, Button, Alert, AlertIcon, AlertTitle, AlertDescription, List, ListItem, ListIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Center, Link, HStack, Table, Thead, Tbody, Tr, Th, Td, ButtonGroup, Container, useMediaQuery } from '@chakra-ui/react';
import { MdCheckCircle, MdGridView, MdList } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { billsApi } from '../api/client';
import { format } from 'date-fns';
import type { AISummary, Bill } from '../api/client';
import { Tweet } from 'react-tweet';

function Header() {
  return (
    <Center py={8}>
      <Heading size="2xl" bgGradient="linear(to-r, blue.500, green.500)" bgClip="text">
        $BILL On Capitol Hill
      </Heading>
    </Center>
  );
}

function ProjectDescription() {
  return (
    <VStack spacing={6} align="stretch" p={4}>
      <Box>
        <Heading size="lg" mb={3}>About $BILL</Heading>
        <Text>
          $BILL is a community-driven token that brings transparency to legislative processes through AI-powered analysis of bills and amendments in Congress.
        </Text>
      </Box>
      
      <Box>
        <Heading size="lg" mb={3}>Our Mission</Heading>
        <Text>
          We aim to make legislative information more accessible and understandable to everyone, combining blockchain technology with artificial intelligence to create a more informed citizenry.
        </Text>
      </Box>
      
      <Box>
        <Heading size="lg" mb={3}>How It Works</Heading>
        <Text>
          Our AI analyzes every bill and amendment in Congress, providing clear summaries, cost impacts, and analysis of how each piece of legislation might affect government size, markets, and individual liberty.
        </Text>
      </Box>
    </VStack>
  );
}

export function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['recent-summaries'],
    queryFn: () => billsApi.getRecentSummaries(20),
  });

  if (isLoading) {
    return (
      <Container maxW="960px">
        <VStack spacing={4} align="stretch">
          <Header />
          <Text>Loading latest updates...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="960px">
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
      </Container>
    );
  }

  const buyButton = (
    <Link 
      href="https://pump.fun/coin/AcWWoJCFLVxiHCnSBhB1Paz6ZLr4PbeorodEFe5Ypump" 
      isExternal 
      _hover={{ textDecoration: 'none' }}
      width="100%"
      display="block"
    >
      <Box 
        bg="green.200" 
        p={4} 
        textAlign="center"
        position={isLargerThan768 ? 'relative' : 'fixed'}
        bottom={isLargerThan768 ? 'auto' : 0}
        left={isLargerThan768 ? 'auto' : 0}
        right={isLargerThan768 ? 'auto' : 0}
        width="100%"
        zIndex={1000}
        boxShadow={!isLargerThan768 ? "0 -2px 10px rgba(0,0,0,0.1)" : "none"}
        _hover={{ bg: 'green.300' }}
        transition="background 0.2s"
      >
        <Text fontWeight="900" color="green.800">
          Buy on Pumpfun
        </Text>
      </Box>
    </Link>
  );

  const filteredResponse = response?.filter(summary => 
    !summary.bill.title.toLowerCase().includes('designate the facility of the united states postal service')
  );

  function getBranchStatus(bill: Bill, branch: 'House' | 'Senate' | 'President'): string {
    const actions = bill.latest_action_text.toLowerCase();
    
    // If it's at the president's desk, it passed both chambers
    if (actions.includes('to president')) {
      if (branch === 'President') return '⏰';
      return '✅'; // Both House and Senate passed it
    }
    
    if (branch === 'House') {
      if (actions.includes('passed house')) return '✅';
      if (actions.includes('failed in house')) return '❌';
      if (actions.includes('in house')) return '⏰';
      return '–';
    }
    
    if (branch === 'Senate') {
      if (actions.includes('passed senate')) return '✅';
      if (actions.includes('failed in senate')) return '❌';
      if (actions.includes('in senate')) return '⏰';
      return '–';
    }
    
    if (branch === 'President') {
      if (actions.includes('signed by president')) return '✅';
      if (actions.includes('vetoed')) return '❌';
      return '–';
    }
    
    return '–';
  }

  return (
    <Container maxW="960px" pb={!isLargerThan768 ? '60px' : 0}>
      <VStack spacing={8} align="stretch">
        <Header />
        
        {isLargerThan768 && buyButton}
        
        <ProjectDescription />

        <VStack spacing={6} align="stretch" p={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>The inspiration for the project</Text>
            <Tweet id="1869865296376303763" />
          </Box>
          
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
        </VStack>

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
          <Grid templateColumns="repeat(2, 1fr)" gap={6} p={4}>
            {filteredResponse?.map((summary: AISummary) => {
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
                  <Th textAlign="center">House</Th>
                  <Th textAlign="center">Senate</Th>
                  <Th textAlign="center">President</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredResponse?.map((summary: AISummary) => {
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
                      <Td>{bill.popular_title || bill.title}</Td>
                      <Td fontSize="xl" textAlign="center">{getBranchStatus(bill, 'House')}</Td>
                      <Td fontSize="xl" textAlign="center">{getBranchStatus(bill, 'Senate')}</Td>
                      <Td fontSize="xl" textAlign="center">{getBranchStatus(bill, 'President')}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
      
      {!isLargerThan768 && buyButton}
    </Container>
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
            {bill.bill_type} {bill.bill_number}: {bill.popular_title || bill.title}
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