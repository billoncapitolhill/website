import axios from 'axios';
import { mockSummaries } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export interface Bill {
  id: string;
  congress_number: number;
  bill_type: string;
  bill_number: number;
  title: string;
  description: string;
  origin_chamber: string;
  origin_chamber_code: string;
  introduced_date: string;
  latest_action_date: string;
  latest_action_text: string;
  update_date: string;
  constitutional_authority_text: string;
  url: string;
  amendments: Amendment[];
  ai_summary: AISummary;
}

export interface Amendment {
  id: string;
  bill_id: string;
  congress_number: number;
  amendment_type: string;
  amendment_number: number;
  description: string;
  purpose: string;
  submitted_date: string;
  latest_action_date: string;
  latest_action_text: string;
  chamber: string;
  url: string;
  ai_summary: AISummary;
}

export interface AISummary {
  id: string;
  target_id: string;
  target_type: 'bill' | 'amendment';
  summary: string;
  analysis: string;
  sentiment: number;
  created_at: string;
  updated_at: string;
  key_points: string[];
  estimated_cost_impact: string;
  government_growth_analysis: string;
  market_impact_analysis: string;
  liberty_impact_analysis: string;
  bill?: Bill;
}

interface SummaryResponse {
  summaries: AISummary[];
}

export interface ErrorResponse {
  detail: string;
}

export const billsApi = {
  getBill: async (congress: number, billType: string, billNumber: string): Promise<Bill> => {
    if (USE_MOCK_DATA) {
      // Mock response for development
      const mockBill = mockSummaries.find(s => 
        s.target_type === 'bill' && 
        s.target_id === `${congress}/${billType}/${billNumber}`
      );
      
      if (!mockBill) {
        throw new Error('Bill not found');
      }

      return {
        id: mockBill.id,
        congress_number: congress,
        bill_type: billType,
        bill_number: parseInt(billNumber),
        title: 'Mock Bill Title',
        description: mockBill.summary,
        origin_chamber: billType.startsWith('H') ? 'House' : 'Senate',
        origin_chamber_code: billType.startsWith('H') ? 'H' : 'S',
        introduced_date: mockBill.created_at,
        latest_action_date: mockBill.updated_at,
        latest_action_text: 'Mock latest action',
        update_date: mockBill.updated_at,
        constitutional_authority_text: 'Mock constitutional authority',
        url: `https://www.congress.gov/bill/${congress}th-congress/${billType.toLowerCase()}/${billNumber}`,
        amendments: [],
        ai_summary: mockBill,
      };
    }
    
    const { data } = await api.get<Bill>(`/api/v1/bills/${congress}/${billType}/${billNumber}`);
    return data;
  },
  
  getAmendment: async (congress: number, amendmentType: string, amendmentNumber: number): Promise<Amendment> => {
    if (USE_MOCK_DATA) {
      // Mock response for development
      const mockAmendment = mockSummaries.find(s => 
        s.target_type === 'amendment' && 
        s.target_id === `${congress}/${amendmentType}/${amendmentNumber}`
      );
      
      if (!mockAmendment) {
        throw new Error('Amendment not found');
      }

      return {
        id: mockAmendment.id,
        bill_id: '118/HR/1000',
        congress_number: congress,
        amendment_type: amendmentType,
        amendment_number: amendmentNumber,
        description: mockAmendment.summary,
        purpose: mockAmendment.analysis,
        submitted_date: mockAmendment.created_at,
        latest_action_date: mockAmendment.updated_at,
        latest_action_text: 'Mock latest action',
        chamber: amendmentType.startsWith('H') ? 'House' : 'Senate',
        url: `https://www.congress.gov/amendment/${congress}th-congress/${amendmentType.toLowerCase()}/${amendmentNumber}`,
        ai_summary: mockAmendment,
      };
    }
    
    const { data } = await api.get<Amendment>(`/api/v1/amendments/${congress}/${amendmentType}/${amendmentNumber}`);
    return data;
  },
  
  getRecentSummaries: async (limit: number = 10): Promise<AISummary[]> => {
    if (USE_MOCK_DATA) {
      // Return mock data in development
      return mockSummaries.slice(0, limit);
    }
    
    try {
      const { data } = await api.get<SummaryResponse>(`/api/v1/summaries/recent`, {
        params: { limit },
      });

      // Log the raw response for debugging
      console.log('Raw summaries response:', data);

      // Return the summaries array from the response
      return data.summaries || [];
    } catch (error) {
      console.error('Error fetching summaries:', error);
      throw error;
    }
  },
  
  getProcessingErrors: async (): Promise<ErrorResponse[]> => {
    if (USE_MOCK_DATA) {
      // Return empty array in development
      return [];
    }
    
    const { data } = await api.get<ErrorResponse[]>(`/api/v1/status/errors`);
    return data;
  },
}; 