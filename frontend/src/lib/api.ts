import {
  PredictRequest,
  PredictResponse,
  DatasetOptionsResponse,
  WhatIfRequest,
  WhatIfResponse,
  InsightsResponse,
  ModelCardData
} from '../types/api';

// Uses VITE_API_URL if configured, otherwise falls back to relative /api in production
// (routed via Vercel services rewrite) and http://localhost:8000 during standalone local dev
const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          errMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        // use default message
      }
      throw new ApiError(errMsg, res.status);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Unable to reach MindScroll AI backend at ${API_BASE_URL}. Please ensure the backend is running.`,
      0
    );
  }
}

export const api = {
  getHealth: () => request<{ status: string; model_loaded: boolean; dataset_loaded: boolean }>('/health'),
  
  getOptions: () => request<DatasetOptionsResponse>('/options'),

  predict: (data: PredictRequest) =>
    request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  whatIf: (data: WhatIfRequest) =>
    request<WhatIfResponse>('/whatif', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getInsights: (filters?: { gender?: string; academic_level?: string; country?: string }) => {
    const params = new URLSearchParams();
    if (filters?.gender && filters.gender !== 'All') params.append('gender', filters.gender);
    if (filters?.academic_level && filters.academic_level !== 'All') params.append('academic_level', filters.academic_level);
    if (filters?.country && filters.country !== 'All') params.append('country', filters.country);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<InsightsResponse>(`/insights${queryString}`);
  },

  getModelCard: () => request<ModelCardData>('/model-card'),
};
