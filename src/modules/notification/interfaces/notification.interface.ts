import type { User } from '../../user/interfaces/user.interface';

export interface Notification {
  id: string;
  type: string; // EVENT_REMINDER, TICKET_PURCHASE, NEW_COMMENT, etc.
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  // Relations
  user: User;
  userId: string;
  sentBy?: User;
  sentById?: string;
}
