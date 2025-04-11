import { EventCategory } from '../../category/inteefaces/category.interface';
import { Company } from '../../company/interfaces/company.interface';
import { User } from '../../user/interfaces/user.interface';

export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

export enum EventFormat {
  CONFERENCE = 'CONFERENCE',
  LECTURE = 'LECTURE',
  WORKSHOP = 'WORKSHOP',
  FESTIVAL = 'FESTIVAL',
  OTHER = 'OTHER'
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  startDate: string;
  endDate?: string;
  publishDate?: string;
  location?: Location;
  price?: number;
  maxAttendees?: number;
  currentAttendees?: number;
  showAttendees?: 'ALL' | 'ATTENDEES_ONLY';
  notifyOrganizer?: boolean;
  redirectUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  company?: Company;
  categoryId?: string;
  category?: EventCategory;
  format?: EventFormat;
  attendees?: User[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  user?: User;
  eventId: string;
}
