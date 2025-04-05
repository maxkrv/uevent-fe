import { z } from 'zod';

import { CategoryValidator } from '~/types/category';
import { CommentValidator } from '~/types/comment';
import { PostValidator } from '~/types/post';
import { UserValidator } from '~/types/user';

export const PaginationResponse = z.object({
  items: z.array(z.unknown()),
  meta: z.object({
    itemCount: z.number(),
    totalItems: z.number(),
    itemsPerPage: z.number(),
    currentPage: z.number()
  }),
  links: z.object({
    first: z.string(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
    last: z.string()
  })
});
export interface IPaginationResponse<T> extends z.infer<typeof PaginationResponse> {
  items: T[];
}
interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

interface PaginationLinks {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
}

export interface Paginated<TData extends object> {
  items: TData[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export const PaginatedPostsValidator = PaginationResponse.extend({
  items: PostValidator.array()
});

export type IPaginatedPosts = z.infer<typeof PaginatedPostsValidator>;

export const PaginatedUsersValidator = PaginationResponse.extend({
  items: UserValidator.array()
});

export type IPaginatedUsers = z.infer<typeof PaginatedUsersValidator>;

export const PaginatedCommentsValidator = PaginationResponse.extend({
  items: CommentValidator.array()
});

export type IPaginatedComments = z.infer<typeof PaginatedCommentsValidator>;

export const PaginatedCategoriesValidator = PaginationResponse.extend({
  items: CategoryValidator.array()
});

export type IPaginatedCategories = z.infer<typeof PaginatedCategoriesValidator>;
