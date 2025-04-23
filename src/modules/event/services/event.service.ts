import { z } from 'zod';

import { mockEvents } from '../../../__mock__/events';
import { mockUsers } from '../../../__mock__/users';
import { apiClient } from '../../../shared/api/api';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import type { User } from '../../user/interfaces/user.interface';
import { Event, EventFormatType, EventThemeType } from '../interfaces/event.interface';

export type EventSortOption = 'date' | 'price-low' | 'price-high' | 'name';

export const EventGetManySchema = z.object({
  search: z.string().optional(),
  companyId: z.string().optional(),
  format: z.array(z.nativeEnum(EventFormatType)).optional(),
  themes: z.array(z.nativeEnum(EventThemeType)).optional(),
  fromDate: z.date().optional().nullable(),
  toDate: z.date().optional().nullable(),
  priceFrom: z.number().optional().nullable(),
  priceTo: z.number().optional().nullable(),
  sort: z.enum(['date', 'price-low', 'price-high', 'name']).optional()
});
export type EventGetManyDto = z.infer<typeof EventGetManySchema> & PaginationDto;

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

  static getMany(dto: EventGetManyDto) {
    const searchParams = new URLSearchParams();

    Object.entries(dto).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((val) => searchParams.append(key, val));
        } else if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    console.log('🚀 ~ EventService ~ getMany ~ searchParams.toString():', searchParams.toString());

    return apiClient.get('events', { searchParams }).json<Paginated<Event>>();
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
