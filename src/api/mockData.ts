import type { AISummary } from './client';

export const mockSummaries: AISummary[] = [
  {
    id: '1',
    target_id: '118/HR/2811',
    target_type: 'bill',
    summary: 'Strengthens cybersecurity measures for critical infrastructure and establishes new reporting requirements for cyber incidents.',
    analysis: 'This bill aims to enhance national cybersecurity by implementing stricter protocols and mandatory reporting.',
    sentiment: 0.8,
    created_at: '2023-12-15T10:00:00Z',
    updated_at: '2023-12-15T10:00:00Z'
  },
  {
    id: '2',
    target_id: '118/S/3001',
    target_type: 'bill',
    summary: 'Expands renewable energy tax credits and establishes new incentives for clean energy manufacturing.',
    analysis: 'The bill provides significant financial support for clean energy initiatives and domestic manufacturing.',
    sentiment: 0.6,
    created_at: '2023-12-14T15:30:00Z',
    updated_at: '2023-12-14T15:30:00Z'
  },
  {
    id: '3',
    target_id: '118/HAMDT/124',
    target_type: 'amendment',
    summary: 'Modifies funding allocation for infrastructure projects to prioritize rural communities.',
    analysis: 'This amendment shifts resources to address infrastructure needs in underserved rural areas.',
    sentiment: 0.4,
    created_at: '2023-12-13T09:15:00Z',
    updated_at: '2023-12-13T09:15:00Z'
  },
  {
    id: '4',
    target_id: '118/HR/3456',
    target_type: 'bill',
    summary: 'Implements new regulations for artificial intelligence development and deployment.',
    analysis: 'Focuses on establishing safety and ethical guidelines for AI technology.',
    sentiment: 0.2,
    created_at: '2023-12-12T14:20:00Z',
    updated_at: '2023-12-12T14:20:00Z'
  },
  {
    id: '5',
    target_id: '118/SAMDT/89',
    target_type: 'amendment',
    summary: 'Adds provisions for increased oversight of healthcare pricing transparency.',
    analysis: 'Strengthens consumer protections in healthcare pricing.',
    sentiment: 0.7,
    created_at: '2023-12-11T11:45:00Z',
    updated_at: '2023-12-11T11:45:00Z'
  }
]; 