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
}

export interface SelectTopicResponse {
  success: boolean;
  data: {
    message: string;
    sessionId: string;
  };
  timestamp: string;
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
  essayText: string;
  question: string;
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
    session: {
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
    essayResult: {
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
      '/api/essay/sessions/select-topic',
      payload,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },

  startEssay: async (): Promise<StartEssayResponse> => {
    const response = await axiosInstance.post(
      '/api/essay/sessions/start-essay',
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
    const response = await axiosInstance.post(
      '/api/essay/sessions/submit',
      payload,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
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
