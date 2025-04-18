type CommentSortBy = 'createdAt' | 'id' | 'popularity';

export interface CommentGetManyDto {
  page?: number;
  limit?: number;
  sortBy?: CommentSortBy;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
  eventId?: string;
  parentId?: string;
  newsId?: string;
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
  userId?: string;
  newsId?: string;
  eventId?: string;
}

export interface UpdateCommentDto {
  content?: string;
}
