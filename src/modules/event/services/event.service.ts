import { mockEvents } from '../../../__mock__/events';
import { mockUsers } from '../../../__mock__/users';
import { apiClient } from '../../../shared/api/api';
import type { SortOrder } from '../../../shared/types/interfaces';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import type { User } from '../../user/interfaces/user.interface';
import type { Event, EventFormatType, EventThemeType, Location } from '../interfaces/event.interface';

export interface EventGetManyDto extends PaginationDto {
  search?: string;
  userId?: string;
  location?: Omit<Location, 'id'>;
  companyId?: string;
  format?: EventFormatType[];
  themes?: EventThemeType[];
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: SortOrder;
  priceFrom?: number;
  priceTo?: number;
}

interface CreateEventDto {
  title: string;
  description?: string;
  publishAt?: Date;
  locationId?: string;
  companyId: string;
  startDate: Date;
  endDate: Date;
  posterUrl?: string;
  price: number;
  maxAttendees?: number;
  showAttendeeList: boolean;
  notifyOnNewAttendee: boolean;
  redirectUrl?: string;
  format: EventFormatType;
  themes: EventThemeType[];
}

export class EventService {
  static getById(id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find((event) => event.id === id);
        if (event) {
          resolve(event);
        } else {
          reject(new Error('Event not found'));
        }
      }, 1000);
    });
    // In a real implementation, this would be:
    // return apiClient.get(`/events/${id}`).json<Event>();
  }

  static getMany(_opt: EventGetManyDto): Promise<Paginated<Event>> {
    // In a real implementation, this would be:
    // return apiClient.get('/events', { json: opt }).json<Paginated<Event>>();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: mockEvents,
          meta: {
            currentPage: 4,
            totalItemsCount: mockEvents.length,
            itemsPerPage: 10,
            totalPages: 12
          }
        });
      }, 1000);
    });
  }

  static create(dto: CreateEventDto): Promise<Event> {
    return apiClient.post('/events', { json: dto }).json<Event>();
  }

  static update(id: string, dto: Partial<CreateEventDto>): Promise<Event> {
    return apiClient.patch(`/events/${id}`, { json: dto }).json<Event>();
  }

  static delete(id: string): Promise<void> {
    return apiClient.delete(`/events/${id}`).json<void>();
  }

  static getAttendees(id: string): Promise<Paginated<User>> {
    // In a real implementation, this would be:
    // return apiClient.get(`/events/${id}/attendees`).json<Paginated<User>>();

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the event
        const event = mockEvents.find((e) => e.id === id);

        // If event has attendees, return them, otherwise return mock users
        const attendeeUsers = event?.attendees
          ? (event.attendees.map((a) => a.user).filter(Boolean) as User[])
          : mockUsers.slice(0, 10);

        resolve({
          items: attendeeUsers,
          meta: {
            currentPage: 1,
            totalItemsCount: attendeeUsers.length,
            itemsPerPage: 10,
            totalPages: Math.ceil(attendeeUsers.length / 10)
          }
        });
      }, 1000);
    });
  }
}
