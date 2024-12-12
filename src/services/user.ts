import api from './api';
import { User } from './auth';

export interface UserProfile extends User {
  createdAt: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  profileImage?: string;
}

const UserService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.patch<UserProfile>('/users/profile', data);
    return response.data;
  }
};

export default UserService;
