/**
 * 3WATLY Unified API Client
 * Connects frontend directly to FastAPI backend on http://127.0.0.1:8000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('majra_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      console.warn(`API error on ${endpoint}: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`Network error on ${endpoint} - backend may be offline.`);
    return null;
  }
}

export const ApiService = {
  // Jobs
  getJobs: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchFromApi<any>(`/api/jobs${qs}`);
  },
  getJobDetails: (id: string) => fetchFromApi<any>(`/api/jobs/${id}`),

  // Market Analytics
  getMarketStats: () => fetchFromApi<any>('/api/market/stats'),
  getMarketOverview: () => fetchFromApi<any>('/api/market/stats'),

  // Candidate Matching
  matchUser: (data: { candidate_skills: string[]; experience_years?: number; target_role?: string; preferred_locations?: string[] }) => {
    return fetchFromApi<any>('/api/matching/match-user', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Real CV Upload & ATS Analysis
  uploadAndParseCv: (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('majra_token') : null;
    return fetch(`${API_BASE}/api/cv/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.ok ? r.json() : null).catch(() => null);
  },

  analyzeCv: (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('majra_token') : null;
    return fetch(`${API_BASE}/api/cv/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.ok ? r.json() : null).catch(() => null);
  },

  // NLP Analysis
  analyzeJobText: (text: string, title?: string) => {
    return fetchFromApi<any>('/api/nlp/analyze-job', {
      method: 'POST',
      body: JSON.stringify({ raw_text: text, job_title: title })
    });
  }
};
