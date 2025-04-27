import dayjs from 'dayjs';
import { z } from 'zod';

import { apiClient } from '../../../shared/api/api';
import type { Paginated } from '../../../shared/types/pagination';
import type { User } from '../../user/interfaces/user.interface';
import { Event, EventFormatType, EventThemeType } from '../interfaces/event.interface';

export type EventSortOption = 'date-asc' | 'date-desc' | 'price-low' | 'price-high' | 'name';

export const EventGetManySchema = z.object({
  search: z.string().optional(),
  companyId: z.string().nullable().optional(),
  format: z.array(z.nativeEnum(EventFormatType)).optional(),
  themes: z.array(z.nativeEnum(EventThemeType)).optional(),
  fromDate: z.coerce.date().optional().nullable(),
  toDate: z.coerce.date().optional().nullable(),
  priceFrom: z.number().optional().nullable(),
  priceTo: z.number().optional().nullable(),
  sort: z.enum(['date-asc', 'date-desc', 'price-low', 'price-high', 'name']).optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  //ignore address for now it is FE only
  address: z.string().nullable().optional(),
  page: z.coerce.number().nullable().optional(),
  limit: z.coerce.number().nullable().optional()
});
export type EventGetManyDto = z.infer<typeof EventGetManySchema>;
const BaseEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  publishAt: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'Publish date must be in the future'
    })
    .optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string()
    })
    .nullable()
    .optional(),
  companyId: z.string().min(1),
  startDate: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'Start date must be in the future'
    })
    .optional(),
  endDate: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'End date must be in the future'
    })
    .optional(),
  posterUrl: z.string().optional(),
  price: z.number().min(0),
  maxAttendees: z.number().nullable().optional(),
  showAttendeeList: z.boolean(),
  notifyOnNewAttendee: z.boolean(),
  redirectUrl: z.string().nullable().optional(),
  format: z.nativeEnum(EventFormatType),
  themes: z.array(z.nativeEnum(EventThemeType))
});

export const CreateEventSchema = BaseEventSchema.refine(
  (data) => (data.startDate && data.endDate ? dayjs(data.startDate).isBefore(data.endDate) : true),
  {
    path: ['endDate'],
    message: 'End date must be after the start date'
  }
)
  .refine((data) => (data.publishAt && data.startDate ? data.publishAt < data.startDate : true), {
    path: ['publishAt'],
    message: 'Publish date must be before start date'
  })
  .refine((data) => ((data.startDate && !data.endDate) || (!data.startDate && data.endDate) ? false : true), {
    path: ['endDate'],
    message: 'Both start date and end date must be provided or neither'
  });

export type CreateEventDto = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = BaseEventSchema.partial();

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;

export class EventService {
  static getById(id: string): Promise<Event> {
    return apiClient.get(`events/${id}`).json<Event>();
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

    return apiClient.get('events', { searchParams }).json<Paginated<Event>>();
  }

  static create(dto: CreateEventDto): Promise<Event> {
    return apiClient.post('events', { json: dto }).json<Event>();
  }

  static uploadPoster(id: string, file: File): Promise<Event> {
    const formData = new FormData();
    formData.append('poster', file);
    return apiClient.patch(`events/${id}/poster`, { body: formData }).json<Event>();
  }

  static update(id: string, dto: Partial<CreateEventDto>): Promise<Event> {
    return apiClient.patch(`events/${id}`, { json: dto }).json<Event>();
  }

  static delete(id: string): Promise<void> {
    return apiClient.delete(`events/${id}`).json<void>();
  }

  static getAttendees(id: string): Promise<Paginated<User>> {
    return apiClient.get(`events/${id}/attendees`).json<Paginated<User>>();
  }

  static getAttendeesCount(id: string): Promise<{ currentAttendees: number }> {
    return apiClient.get(`events/${id}/attendees/count`).json();
  }
}
