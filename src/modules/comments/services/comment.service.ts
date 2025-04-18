import { v4 as uuidv4 } from 'uuid';

import { mockData } from '../../../__mock__/data';
import type { Paginated } from '../../../shared/types/pagination';
import type { CommentGetManyDto, CreateCommentDto, UpdateCommentDto } from '../interfaces/comment.dto';
import type { Comment } from '../interfaces/comment.interface';
import type { Reaction, ReactionCount, ReactionType } from '../interfaces/reaction.interface';

// Get mock comments from the mock data
const mockComments = mockData.comments;

export class CommentService {
  static getById(id: string): Promise<Comment> {
    // In a real implementation, this would be:
    // return apiClient.get(`comments/${id}`).json<Comment>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comment = mockComments.find((c) => c.id === id);
        if (comment) {
          resolve(comment);
        } else {
          reject(new Error('Comment not found'));
        }
      }, 500);
    });
  }

  static getMany(opt: CommentGetManyDto): Promise<Paginated<Comment>> {
    // In a real implementation, this would be:
    // return apiClient.get(`comments`, { json: opt }).json<Paginated<Comment>>()

    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredComments = [...mockComments];

        // Filter by event ID
        if (opt.eventId) {
          filteredComments = filteredComments.filter((c) => c.eventId === opt.eventId);
        }

        // Filter by news ID
        if (opt.newsId) {
          filteredComments = filteredComments.filter((c) => c.companyNewsId === opt.newsId);
        }

        // Filter by parent ID
        if (opt.parentId) {
          filteredComments = filteredComments.filter((c) => c.parentId === opt.parentId);
        }

        // Filter by user ID
        if (opt.userId) {
          filteredComments = filteredComments.filter((c) => c.userId === opt.userId);
        }

        // Sort comments
        if (opt.sortBy) {
          filteredComments.sort((a, b) => {
            if (opt.sortBy === 'popularity') {
              // Sort by number of reactions
              const aReactions = a.reactions?.length || 0;
              const bReactions = b.reactions?.length || 0;
              return opt.sortOrder === 'asc' ? aReactions - bReactions : bReactions - aReactions;
            } else {
              // Sort by date
              const aDate = new Date(a.createdAt).getTime();
              const bDate = new Date(b.createdAt).getTime();
              return opt.sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
            }
          });
        } else {
          // Default sort by newest first
          filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        // Apply pagination
        const page = opt.page || 1;
        const limit = opt.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedComments = filteredComments.slice(startIndex, endIndex);

        resolve({
          items: paginatedComments,
          meta: {
            currentPage: page,
            totalItemsCount: filteredComments.length,
            itemsPerPage: limit,
            totalPages: Math.ceil(filteredComments.length / limit)
          }
        });
      }, 800);
    });
  }

  static create(dto: CreateCommentDto): Promise<Comment> {
    // In a real implementation, this would be:
    // return apiClient.post(`comments`, { json: dto }).json<Comment>()

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the user
        const user = mockData.users.find((u) => u.id === dto.userId);

        // Create a new comment
        const newComment: Comment = {
          id: uuidv4(),
          content: dto.content,
          createdAt: new Date(),
          updatedAt: new Date(),
          eventId: dto.eventId,
          companyNewsId: dto.newsId,
          userId: dto.userId || '',
          parentId: dto.parentId,
          user: user!,
          reactions: [],
          replies: []
        };

        // Add to mock comments
        mockComments.push(newComment);

        resolve(newComment);
      }, 800);
    });
  }

  static update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    // In a real implementation, this would be:
    // return apiClient.patch(`comments/${id}`, { json: dto }).json<Comment>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const commentIndex = mockComments.findIndex((c) => c.id === id);
        if (commentIndex === -1) {
          reject(new Error('Comment not found'));
          return;
        }

        // Update the comment
        mockComments[commentIndex] = {
          ...mockComments[commentIndex],
          ...dto,
          updatedAt: new Date()
        };

        resolve(mockComments[commentIndex]);
      }, 500);
    });
  }

  static delete(id: string): Promise<void> {
    // In a real implementation, this would be:
    // return apiClient.delete(`comments/${id}`).json<void>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const commentIndex = mockComments.findIndex((c) => c.id === id);
        if (commentIndex === -1) {
          reject(new Error('Comment not found'));
          return;
        }

        // Remove the comment
        mockComments.splice(commentIndex, 1);

        resolve();
      }, 500);
    });
  }

  static getReactionsCount(commentId: string): Promise<ReactionCount> {
    // In a real implementation, this would be:
    // return apiClient.get(`comments/${commentId}/reactions/count`).json<ReactionCount>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comment = mockComments.find((c) => c.id === commentId);
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }

        // Count reactions by type
        const reactionCount: ReactionCount = {
          LIKE: 0,
          DISLIKE: 0,
          LOVE: 0,
          LAUGH: 0,
          SAD: 0,
          ANGRY: 0
        };

        comment.reactions?.forEach((reaction) => {
          reactionCount[reaction.type]++;
        });

        resolve(reactionCount);
      }, 500);
    });
  }

  static react(commentId: string, reactionType: string): Promise<Reaction> {
    // In a real implementation, this would be:
    // return apiClient.post(`comments/${commentId}/reactions/my`, { json: { type: reactionType } }).json<Reaction>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comment = mockComments.find((c) => c.id === commentId);
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }

        // Create a new reaction
        const newReaction: Reaction = {
          id: uuidv4(),
          type: reactionType as ReactionType,
          createdAt: new Date(),
          userId: 'current-user-id', // This would be the current user's ID
          commentId,
          user: mockData.users[0] // This would be the current user
        };

        // Add to comment reactions
        if (!comment.reactions) {
          comment.reactions = [];
        }

        comment.reactions.push(newReaction);

        resolve(newReaction);
      }, 500);
    });
  }

  static deleteReaction(commentId: string): Promise<Reaction> {
    // In a real implementation, this would be:
    // return apiClient.delete(`comments/${commentId}/reactions/my`).json<Reaction>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comment = mockComments.find((c) => c.id === commentId);
        if (!comment || !comment.reactions) {
          reject(new Error('Comment or reaction not found'));
          return;
        }

        // Find the user's reaction
        const reactionIndex = comment.reactions.findIndex((r) => r.userId === 'current-user-id');
        if (reactionIndex === -1) {
          reject(new Error('Reaction not found'));
          return;
        }

        // Remove the reaction
        const removedReaction = comment.reactions[reactionIndex];
        comment.reactions.splice(reactionIndex, 1);

        resolve(removedReaction);
      }, 500);
    });
  }

  static getReactionsByUser(commentId: string): Promise<Reaction[]> {
    // In a real implementation, this would be:
    // return apiClient.get(`comments/${commentId}/reactions/my`).json<Reaction[]>()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comment = mockComments.find((c) => c.id === commentId);
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }

        // Find the user's reactions
        const userReactions = comment.reactions?.filter((r) => r.userId === 'current-user-id') || [];

        resolve(userReactions);
      }, 500);
    });
  }
}
