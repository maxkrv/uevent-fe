import type { Comment } from '../../comments/interfaces/comment.interface';
import type { Reaction } from '../../comments/interfaces/reaction.interface';
import type { Company } from './company.interface';

export interface CompanyNews {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  // Relations
  company: Company;
  comments?: Comment[];
  reaction?: Reaction[];
}
