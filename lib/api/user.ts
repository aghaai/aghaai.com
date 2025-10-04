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
};
