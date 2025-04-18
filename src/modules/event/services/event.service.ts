import dayjs from 'dayjs';

import { mockEvents } from '../../../__mock__/events';
import { mockUsers } from '../../../__mock__/users';
import { apiClient } from '../../../shared/api/api';
import type { SortOrder } from '../../../shared/types/interfaces';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import type { User } from '../../user/interfaces/user.interface';
import type { Event, EventFormatType, EventThemeType, Location } from '../interfaces/event.interface';

export interface EventGetManyDto extends PaginationDto {
  search?: string;
  location?: Omit<Location, 'id'>;
  companyId?: string;
  format?: EventFormatType[];
  themes?: EventThemeType[];
  startDate?: Date;
  endDate?: Date;
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

  static getMany(opt: EventGetManyDto): Promise<Paginated<Event>> {
    // In a real implementation, this would be:
    // return apiClient.get('/events', { json: opt }).json<Paginated<Event>>();

    return new Promise((resolve) => {
      setTimeout(() => {
        // Apply filters to the mock data
        let filteredEvents = [...mockEvents];

        // Apply search filter
        if (opt.search) {
          const searchLower = opt.search.toLowerCase();
          filteredEvents = filteredEvents.filter(
            (event) =>
              event.title.toLowerCase().includes(searchLower) ||
              event.description.toLowerCase().includes(searchLower) ||
              event.location?.address.toLowerCase().includes(searchLower) ||
              event.company?.name.toLowerCase().includes(searchLower)
          );
        }

        // Filter by company
        if (opt.companyId) {
          filteredEvents = filteredEvents.filter((event) => event.company?.id === opt.companyId);
        }

        // Filter by format
        if (opt.format && opt.format.length > 0) {
          filteredEvents = filteredEvents.filter((event) => opt.format?.includes(event.format));
        }

        // Filter by themes
        if (opt.themes && opt.themes.length > 0) {
          filteredEvents = filteredEvents.filter((event) => event.themes.some((theme) => opt.themes?.includes(theme)));
        }

        // Filter by date range
        if (opt.startDate) {
          filteredEvents = filteredEvents.filter((event) => dayjs(event.startDate).isAfter(dayjs(opt.startDate)));
        }

        if (opt.endDate) {
          filteredEvents = filteredEvents.filter((event) => dayjs(event.startDate).isBefore(dayjs(opt.endDate)));
        }

        // Filter by price range
        if (opt.priceFrom !== undefined) {
          filteredEvents = filteredEvents.filter((event) => event.price >= opt.priceFrom!);
        }

        if (opt.priceTo !== undefined) {
          filteredEvents = filteredEvents.filter((event) => event.price <= opt.priceTo!);
        }

        // Apply sorting
        if (opt.sortOrder) {
          filteredEvents.sort((a, b) => {
            // Default sort by date
            const dateComparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

            if (opt.sortOrder === 'asc') {
              return dateComparison;
            } else {
              return -dateComparison;
            }
          });
        }

        // Apply pagination
        const page = opt.page || 1;
        const limit = opt.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

        resolve({
          items: paginatedEvents,
          meta: {
            currentPage: page,
            totalItemsCount: filteredEvents.length,
            itemsPerPage: limit,
            totalPages: Math.ceil(filteredEvents.length / limit)
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
