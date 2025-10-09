import axiosInstance from './axios';

export interface StartSessionPayload {
  mode: 'text' | 'pdf';
}

export interface StartSessionResponse {
  success: boolean;
  data: {
    message: string;
    sessionId: string;
  };
  timestamp: string;
}

export interface SelectTopicPayload {
  topicId: string;
  sessionId: string;
}

export interface SelectTopicResponse {
  success: boolean;
  data: {
    message: string;
    sessionId: string;
  };
  timestamp: string;
}

export interface StartEssayPayload {
  sessionId: string;
}

export interface StartEssayResponse {
  success: boolean;
  data: {
    message: string;
    sessionId: string;
  };
  timestamp: string;
}

export interface SubmitEssayPayload {
  essayText?: string;
  file?: File;
  sessionId: string;
}

export interface SubmitEssayResponse {
  success: boolean;
  data: {
    message: string;
    result: {
      user: string;
      session: string;
      essayText: string;
      pdfUrl?: string;
      rawResponse: {
        overall_score: number;
        grade: string;
        executive_summary: string;
        [key: string]: unknown;
      };
      extractedMetrics: {
        overall_score: number;
        grade: string;
        executive_summary: string;
        [key: string]: unknown;
      };
      createdAt: string;
      updatedAt: string;
      id: string;
    };
  };
  timestamp: string;
}

export interface EssayResultResponse {
  success: boolean;
  data: {
    message?: string;
    result?: {
      user: string;
      session: string;
      essayText?: string;
      pdfUrl?: string | null;
      rawResponse?: Record<string, unknown>;
      extractedMetrics?: {
        grammarScore?: unknown;
        contentRelevanceScore?: unknown;
        overall?: number;
        grade?: string;
        [key: string]: unknown;
      };
      createdAt: string;
      updatedAt: string;
      id: string;
    };
    // Legacy structure (keeping for backward compatibility)
    session?: {
      _id: string;
      mode: string;
      status: string;
      topic: {
        _id: string;
        title: string;
      };
      startTime: string;
      essayStartTime?: string;
      endTime?: string;
      durationMinutes?: number;
      tokensUsed?: number;
    };
    essayResult?: {
      _id: string;
      user: {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
      essayText?: string;
      pdfUrl?: string;
      rawResponse?: {
        success: boolean;
        data: unknown;
      };
      extractedMetrics?: {
        grammarScore?: unknown;
        contentRelevanceScore?: unknown;
        overall?: number;
        grade?: string;
        [key: string]: unknown;
      };
      createdAt: string;
    };
  };
  message?: string;
  timestamp?: string;
}

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = window.localStorage.getItem('_aT');
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  } as const;
};

export const essayAPI = {
  startSession: async (
    payload: StartSessionPayload,
  ): Promise<StartSessionResponse> => {
    const response = await axiosInstance.post(
      '/api/essay/sessions/start',
      payload,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },

  selectTopic: async (
    payload: SelectTopicPayload,
  ): Promise<SelectTopicResponse> => {
    const response = await axiosInstance.post(
      `/api/essay/sessions/select-topic/${payload.sessionId}`,
      { topicId: payload.topicId },
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },

  startEssay: async (payload: StartEssayPayload): Promise<StartEssayResponse> => {
    const response = await axiosInstance.post(
      `/api/essay/sessions/start-essay/${payload.sessionId}`,
      {},
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },

  submitEssay: async (
    payload: SubmitEssayPayload,
  ): Promise<SubmitEssayResponse> => {
    console.log('🎬 Starting submitEssay with payload:', {
      hasFile: !!payload.file,
      hasText: !!payload.essayText,
      sessionId: payload.sessionId,
    });

    // Create FormData for file upload or use JSON for text
    const formData = new FormData();
    
    if (payload.file) {
      // File upload - append the file
      formData.append('file', payload.file, payload.file.name);
      
      console.log('📎 File details:', {
        name: payload.file.name,
        size: payload.file.size,
        type: payload.file.type,
        lastModified: payload.file.lastModified,
      });
      
      // Verify file is actually added to FormData
      const hasFile = formData.has('file');
      console.log('✓ File added to FormData:', hasFile);
      
      if (hasFile) {
        const fileEntry = formData.get('file');
        console.log('📦 FormData file entry:', {
          isFile: fileEntry instanceof File,
          name: fileEntry instanceof File ? fileEntry.name : 'N/A',
          size: fileEntry instanceof File ? fileEntry.size : 'N/A',
        });
      }
    } else if (payload.essayText) {
      // Text upload
      formData.append('essayText', payload.essayText);
      console.log('📝 Appending essayText, length:', payload.essayText.length);
    }

    // Log all FormData entries
    const entries = Array.from(formData.entries());
    console.log('� FormData has', entries.length, 'entries:');
    entries.forEach(([key, value]) => {
      console.log(`  - ${key}:`, {
        type: value instanceof File ? 'File' : typeof value,
        name: value instanceof File ? value.name : undefined,
        size: value instanceof File ? value.size : undefined,
      });
    });

    const url = `/api/essay/sessions/submit/${payload.sessionId}`;
    console.log('🌐 Making request to:', url);
    console.log('🏠 Base URL:', axiosInstance.defaults.baseURL);
    console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${url}`);

    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          ...getAuthHeader(),
          // Let axios set Content-Type with boundary automatically
        },
      });

      console.log('✅ Response received:', {
        status: response.status,
        success: response.data?.success,
        hasResult: !!response.data?.data?.result,
      });

      return response.data;
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  },
  

  getEssayResult: async (
    sessionId: string,
  ): Promise<EssayResultResponse> => {
    const response = await axiosInstance.get(
      `/api/essay/sessions/result/${sessionId}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },
};

export interface EssayHistoryItem {
  sessionId: string;
  topicTitle: string;
  mode: 'text' | 'pdf';
  date: string;
  status: 'evaluated' | 'pending' | 'in-progress';
}

export interface EssayHistoryResponse {
  success: boolean;
  data: {
    history: EssayHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
  timestamp: string;
}

export const essayHistoryAPI = {
  getHistory: async (page: number = 1, limit: number = 10): Promise<EssayHistoryResponse> => {
    const response = await axiosInstance.get(
      `/api/essay/sessions/history?page=${page}&limit=${limit}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },
};
