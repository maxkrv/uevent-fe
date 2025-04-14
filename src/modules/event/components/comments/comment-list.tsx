'use client';

import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import type { Comment, ReactionType } from '../../interfaces/comment.interface';
import { CommentItem } from './comment-item';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onReply: (content: string, replyToId: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: ReactionType) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  currentUserId?: string;
}

export const CommentList = ({
  comments,
  isLoading,
  onReply,
  onDelete,
  onReaction,
  hasMore,
  onLoadMore,
  isLoadingMore,
  currentUserId
}: CommentListProps) => {
  const [rootComments, setRootComments] = useState<Comment[]>([]);
  const [repliesMap, setRepliesMap] = useState<Record<string, Comment[]>>({});

  // Process comments to separate root comments and replies
  useEffect(() => {
    const roots: Comment[] = [];
    const replies: Record<string, Comment[]> = {};

    comments.forEach((comment) => {
      if (!comment.replyId) {
        // This is a root comment
        roots.push(comment);
      } else {
        // This is a reply
        if (!replies[comment.replyId]) {
          replies[comment.replyId] = [];
        }
        replies[comment.replyId].push(comment);
      }
    });

    // Sort replies by date (newest first)
    Object.keys(replies).forEach((key) => {
      replies[key].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    setRootComments(roots);
    setRepliesMap(replies);
  }, [comments]);

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg mt-6">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No comments yet</h3>
        <p className="text-muted-foreground">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rootComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
          onReaction={onReaction}
          replies={repliesMap[comment.id] || []}
          currentUserId={currentUserId}
        />
      ))}

      {hasMore && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load More Comments'}
          </Button>
        </div>
      )}
    </div>
  );
};
