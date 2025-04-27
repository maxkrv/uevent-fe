import { apiClient } from '../../../shared/api/api';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import type { Company } from '../../company/interfaces/company.interface';
import { Ticket } from '../../ticket/interfaces/ticket.interface';
import type { User } from '../interfaces/user.interface';

export class UserService {
  static async me() {
    return apiClient.get<User>('users/me').json();
  }

  static async getById(id: string): Promise<User> {
    return apiClient.get<User>(`users/${id}`).json();
  }

  static async getFollowedCompanies(userId: string, dto?: PaginationDto): Promise<Paginated<Company>> {
    const searchParams = new URLSearchParams();

    Object.entries(dto || {}).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });

    return apiClient
      .get<Paginated<Company>>(`users/${userId}/companies/following`, {
        searchParams
      })
      .json();
  }

  static async getTickets() {
    return apiClient.get<Paginated<Ticket>>('tickets').json();
  }
  // New methods for user settings
  static async updateUserData(data: { name?: string; bio?: string }): Promise<User> {
    return apiClient.patch<User>('users/me', { json: data }).json();
  }

  static async updateUserSettings(data: Partial<User['settings']>): Promise<User> {
    return apiClient.patch<User>('users/me/settings', { json: data }).json();
  }

  static async updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.patch<User>('users/me/avatar', { body: formData }).json();
  }
}
