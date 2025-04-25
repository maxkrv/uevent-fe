import { apiClient } from '../../../shared/api/api';
import type { Reaction, ReactionCount, ReactionIdRelationField, ReactionType } from '../interfaces/reaction.interface';

export class ReactionService {
  static getMy(): Promise<Reaction[]> {
    return apiClient.get(`reactions/my`).json<Reaction[]>();
  }

  static react(to: ReactionIdRelationField, reactionType: ReactionType): Promise<Reaction> {
    return apiClient.post(`reactions`, { json: { type: reactionType, ...to } }).json<Reaction>();
  }

  static delete(id: string): Promise<Reaction> {
    return apiClient.delete(`reactions/${id}`).json<Reaction>();
  }

  static getCounts(to: ReactionIdRelationField): Promise<ReactionCount> {
    const searchParams = Object.entries(to).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc.append(key, value.toString());
      }
      return acc;
    }, new URLSearchParams());

    return apiClient.get(`reactions/count`, { searchParams }).json<ReactionCount>();
  }
}
