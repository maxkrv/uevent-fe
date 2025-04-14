export interface Company {
  id: string;
  name: string;
  description?: string;
  email?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  eventCount?: number;
  subscriberCount?: number;
}
