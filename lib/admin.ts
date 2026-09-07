import { apiClient } from "./axios";

export interface UserItem {
  id: number;
  uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  cooperative_id: number | null;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  page: number;
  page_size: number;
  items: UserItem[];
}

export interface CreateStaffPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  cooperative_id?: number;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: string;
}

export const adminApi = {
  getUsers: async (page = 1, limit = 10, userType?: string): Promise<UserListResponse> => {
    const skip = (page - 1) * limit;
    const { data } = await apiClient.get('/users', {
      params: { skip, limit, user_type: userType },
    });
    return data;
  },

  createStaff: async (payload: CreateStaffPayload): Promise<UserItem> => {
    const { data } = await apiClient.post('/users/staff', payload);
    return data;
  },

  updateUser: async (userId: number, payload: UpdateUserPayload): Promise<UserItem> => {
    const { data } = await apiClient.put(`/users/${userId}`, payload);
    return data;
  },

  activateUser: async (userId: number): Promise<UserItem> => {
    const { data } = await apiClient.post(`/users/${userId}/activate`);
    return data;
  },

  deactivateUser: async (userId: number): Promise<UserItem> => {
    const { data } = await apiClient.post(`/users/${userId}/deactivate`);
    return data;
  },
};
