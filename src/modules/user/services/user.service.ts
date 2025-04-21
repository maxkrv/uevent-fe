import { mockCompanies } from '../../../__mock__/companies';
import { mockData } from '../../../__mock__/data';
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

  static async getOwnedCompanies(_opt: PaginationDto): Promise<Paginated<Company>> {
    // return apiClient
    //   .get<Paginated<Company>>(`companies/my`, {
    //     searchParams: Object.entries(opt).reduce((acc, [key, value]) => {
    //       if (value) {
    //         acc.append(key, value.toString());
    //       }
    //       return acc;
    //     }, new URLSearchParams())
    //   })
    //   .json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: mockCompanies,
          meta: {
            totalItemsCount: 100,
            totalPages: 15,
            currentPage: 1,
            itemsPerPage: 12
          }
        });
      }, 500);
    });
  }

  static async getTickets(userId: string): Promise<Ticket[]> {
    // In a real implementation, this would be:
    // return apiClient.get<any[]>(`users/${userId}/tickets`).json()

    return new Promise((resolve) => {
      setTimeout(() => {
        // Get user's tickets from mock data
        const tickets = mockData.tickets.filter((ticket) => ticket.userId === userId);

        resolve(tickets);
      }, 800);
    });
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
