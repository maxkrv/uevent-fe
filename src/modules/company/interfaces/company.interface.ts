import type { Event, Location } from '../../event/interfaces/event.interface';
import type { User } from '../../user/interfaces/user.interface';
import type { CompanyNews } from './news.interface';

export interface Company {
  id: string;
  name: string;
  email: string;
  description?: string;
  logo?: string;
  website?: string;
  coverImage?: string;
  locationId: string;
  stripeAccountId?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  // Relations
  location: Location;
  owner: User;
  events?: Event[];
  news?: CompanyNews[];
  subscribers?: CompanySubscription[];
}

export interface CompanySubscription {
  id: string;
  createdAt: Date;
  companyId: string;
  userId: string;
  // Relations
  user: User;
  company: Company;
}
