import type { Event } from '../../event/interfaces/event.interface';
import type { User } from '../../user/interfaces/user.interface';

export type ReactionType = 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';

export interface Reaction {
  id: string;
  userId: string;
  commentId: string;
  type: ReactionType;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  replyId: string;
  userId: string;
  reactions?: Reaction[];

  // Optionally include related models if needed
  event?: Event;
  user?: User;
  reply?: Comment;
}
