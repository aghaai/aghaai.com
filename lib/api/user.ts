import axiosInstance from './axios';

export type UpdateProfilePayload =
  | {
      name: string;
      phoneNumber: string;
      avatar?: string | null;
    }
  | FormData;

export interface UpdateProfileResponse {
  success?: boolean;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

export interface UserInfo {
  tokens: number;
  usedTopics: string[];
  name: string;
  gender: string | null;
  phoneNumber: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  id: string;
  [key: string]: unknown;
}

export interface GetUserInfoResponse {
  success: boolean;
  data: UserInfo;
  timestamp?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success?: boolean;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

export interface UserStatsTrendItem {
  date: string;
  score?: number;
}

export interface UserStatsData {
  lastScore: number;
  improvement: {
    percent: number;
    direction: "up" | "down" | "no-change";
  };
  averageScore: number;
  passRate: number;
  trend: UserStatsTrendItem[];
  performanceOutcome: {
    successful: number;
    unsuccessful: number;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStatsData;
  timestamp: string;
}

export interface LanguageStyleOverviewItem {
  date: string;
  topicTitle: string;
  overallScore: number;
  grammarScore: number;
  toneScore: number;
  sentenceScore: number;
  vocabScore: number;
}

export interface CoreMatrixOverviewItem {
  date: string;
  topicTitle: string;
  overallScore: number;
  contentRelevance: number;
  organization: number;
  language: number;
  criticalThinking: number;
  outlineQuality: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface LanguageStyleOverviewResponse {
  success: boolean;
  data: {
    overview: LanguageStyleOverviewItem[];
    pagination: PaginationInfo;
  };
  timestamp: string;
}

export interface CoreMatrixOverviewResponse {
  success: boolean;
  data: {
    overview: CoreMatrixOverviewItem[];
    pagination: PaginationInfo;
  };
  timestamp: string;
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

export const userAPI = {
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    const response = await axiosInstance.patch('/api/users/update-profile', payload, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data;
  },
  getUserInfo: async (): Promise<GetUserInfoResponse> => {
    const response = await axiosInstance.get('/api/users/info', {
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data;
  },
  updatePassword: async (
    payload: UpdatePasswordPayload,
  ): Promise<UpdatePasswordResponse> => {
    const response = await axiosInstance.patch('/api/users/update-password', payload, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data;
  },
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await axiosInstance.get('/api/users/user-stats', {
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data;
  },
  getLanguageStyleOverview: async (
    page: number = 1,
    limit: number = 5,
  ): Promise<LanguageStyleOverviewResponse> => {
    const response = await axiosInstance.get(
      `/api/users/evaluation-overview/language-and-style?page=${page}&limit=${limit}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },
  getCoreMatrixOverview: async (
    page: number = 1,
    limit: number = 5,
  ): Promise<CoreMatrixOverviewResponse> => {
    const response = await axiosInstance.get(
      `/api/users/evaluation-overview/core-matrix?page=${page}&limit=${limit}`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    return response.data;
  },
};
