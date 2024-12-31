import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  target_type: string;
  summary: string;
  perspective: string;
  key_points: string[];
  estimated_cost_impact: string;
  government_growth_analysis: string;
  market_impact_analysis: string;
  liberty_impact_analysis: string;
  created_at: string;
  updated_at: string;
  bill: Bill;
}

interface SummaryResponse {
  summaries: AISummary[];
}

export interface ErrorResponse {
  detail: string;
}

export const billsApi = {
  getBill: async (congress: number, billType: string, billNumber: string): Promise<Bill> => {
    const { data } = await api.get<Bill>(`/api/v1/bills/${congress}/${billType}/${billNumber}`);
    return data;
  },
  
  getAmendment: async (congress: number, amendmentType: string, amendmentNumber: number): Promise<Amendment> => {
    const { data } = await api.get<Amendment>(`/api/v1/amendments/${congress}/${amendmentType}/${amendmentNumber}`);
    return data;
  },
  
  getRecentSummaries: async (limit: number = 10): Promise<AISummary[]> => {
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
    const { data } = await api.get<ErrorResponse[]>(`/api/v1/status/errors`);
    return data;
  },
}; 