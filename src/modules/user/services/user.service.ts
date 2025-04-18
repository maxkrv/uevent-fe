import { mockCompanies } from '../../../__mock__/companies';
import { mockData } from '../../../__mock__/data';
import { mockEvents } from '../../../__mock__/events';
import { mockUsers } from '../../../__mock__/users';
import { apiClient } from '../../../shared/api/api';
import type { Paginated } from '../../../shared/types/pagination';
import type { Company } from '../../company/interfaces/company.interface';
import type { Event } from '../../event/interfaces/event.interface';
import { Ticket } from '../../ticket/interfaces/ticket.interface';
import type { User } from '../interfaces/user.interface';

export class UserService {
  static async me() {
    // In a real implementation, this would be:
    return apiClient.get<User>('users/me').json();

    // return new Promise<User>((resolve) => {
    //   setTimeout(() => {
    //     resolve(mockUsers[0]);
    //   }, 500);
    // });
  }

  static async getById(id: string): Promise<User> {
    // In a real implementation, this would be:
    // return apiClient.get<User>(`users/${id}`).json()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }, 800);
    });
  }

  static async getAttendedEvents(userId: string): Promise<Paginated<Event>> {
    // In a real implementation, this would be:
    // return apiClient.get<Paginated<Event>>(`users/${userId}/events`).json()

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find events this user is attending
        const attendedEvents = mockEvents.filter((event) =>
          event.attendees?.some((attendee) => attendee.userId === userId)
        );

        resolve({
          items: attendedEvents,
          meta: {
            currentPage: 1,
            totalItemsCount: attendedEvents.length,
            itemsPerPage: attendedEvents.length,
            totalPages: 1
          }
        });
      }, 800);
    });
  }

  static async getFollowedCompanies(userId: string): Promise<Paginated<Company>> {
    // In a real implementation, this would be:
    // return apiClient.get<Paginated<Company>>(`users/${userId}/companies`).json()

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find companies this user is following
        const followedCompanies = mockCompanies.filter((company) =>
          company.subscribers?.some((sub) => sub.userId === userId)
        );

        resolve({
          items: followedCompanies,
          meta: {
            currentPage: 1,
            totalItemsCount: followedCompanies.length,
            itemsPerPage: followedCompanies.length,
            totalPages: 1
          }
        });
      }, 800);
    });
  }

  static async getOwnedCompanies(userId: string): Promise<Company[]> {
    // In a real implementation, this would be:
    // return apiClient.get<Company[]>(`users/${userId}/owned-companies`).json()

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find companies owned by this user
        const ownedCompanies = mockCompanies.filter((company) => company.ownerId === userId);

        resolve(ownedCompanies);
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
}
