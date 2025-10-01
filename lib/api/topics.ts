import axiosInstance from "./axios";

export interface Topic {
  _id: string;
  title: string;
  timesShown?: number;
  timesChosen?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicsResponse {
  success: boolean;
  data: Topic[];
  timestamp: string;
}

export const topicsAPI = {
  getRandomTopics: async (): Promise<TopicsResponse> => {
    const response = await axiosInstance.get<TopicsResponse>("/api/topics/random");
    return response.data;
  },
};
