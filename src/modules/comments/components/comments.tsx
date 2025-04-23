import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

import { Toggle } from '../../../shared/components/ui/toggle';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { infiniteQueryOptions } from '../../../shared/query/infinite-query-options';
import { CommentService } from '../services/comment.service';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
type SortOption = 'newest' | 'oldest' | 'popular';

interface EventCommentsProps {
  eventId?: string;
  newsId?: string;
  parentId?: string;
}

export const Comments = ({ eventId, newsId, parentId }: EventCommentsProps) => {
  const [showOnlyMyComments, setShowOnlyMyComments] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { data: currentUser } = useAuth();
  const {
    data: comments,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery(
    infiniteQueryOptions({
      queryKey: [QueryKeys.COMMENTS, eventId, newsId, parentId, showOnlyMyComments, sortBy],
      queryFn: ({ pageParam }) => CommentService.getMany({ newsId, parentId, eventId, page: pageParam, limit: 10 })
    })
  );

  // Handle loading more comments
  const handleLoadMore = async () => {
    if (!hasNextPage) return;

    fetchNextPage();
  };

  return (
    <Card className="max-sm:py-0 order-last">
      <CardContent className="gap-4 grid max-sm:p-3">
        <div className="flex flex-row items-center gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 grow">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 justify-end">
              <Toggle
                pressed={showOnlyMyComments}
                onPressedChange={setShowOnlyMyComments}
                className="min-w-30 rounded-full"
                disabled={!currentUser}>
                {showOnlyMyComments ? 'My Only' : 'All Comments'}
              </Toggle>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CommentForm onSubmit={() => {}} />

        <div className="mt-6">
          <CommentList
            comments={comments?.pages.flatMap((page) => page.items) || []}
            isLoading={isLoading}
            onReply={() => {}}
            onDelete={() => {}}
            onReaction={() => {}}
            hasMore={hasNextPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isFetchingNextPage}
            currentUserId={currentUser?.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};
