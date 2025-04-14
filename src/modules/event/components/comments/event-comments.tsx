'use client';

import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { mockUsers } from '@/__mock__/users';
import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

import { Toggle } from '../../../../shared/components/ui/toggle';
import type { Comment, Reaction, ReactionType } from '../../interfaces/comment.interface';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';

// Mock data for comments
const generateMockComments = (eventId: string, count = 10): Comment[] => {
  const comments: Comment[] = [];

  // Generate root comments
  for (let i = 0; i < count; i++) {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Generate random reactions
    const reactions: Reaction[] = [];
    if (Math.random() > 0.3) {
      const reactionCount = Math.floor(Math.random() * 5) + 1;
      const reactionTypes: ReactionType[] = ['LIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY'];

      for (let r = 0; r < reactionCount; r++) {
        const reactingUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];

        reactions.push({
          id: `reaction-${i}-${r}`,
          userId: reactingUser.id,
          commentId: `comment-${i}`,
          type: reactionType
        });
      }
    }

    const comment: Comment = {
      id: `comment-${i}`,
      content: `This is a sample comment ${i}. What a great event this looks like!`,
      createdAt: date,
      updatedAt: date,
      eventId,
      replyId: '',
      userId: randomUser.id,
      user: randomUser,
      reactions: reactions
    };

    comments.push(comment);

    // Add some replies to random comments
    if (Math.random() > 0.6) {
      const replyCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < replyCount; j++) {
        const replyUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const replyDate = new Date(date);
        replyDate.setHours(replyDate.getHours() + Math.floor(Math.random() * 24));

        // Generate random reactions for replies
        const replyReactions: Reaction[] = [];
        if (Math.random() > 0.5) {
          const reactionCount = Math.floor(Math.random() * 3) + 1;
          const reactionTypes: ReactionType[] = ['LIKE', 'LOVE', 'LAUGH'];

          for (let r = 0; r < reactionCount; r++) {
            const reactingUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];

            replyReactions.push({
              id: `reaction-${i}-${j}-${r}`,
              userId: reactingUser.id,
              commentId: `comment-${i}-reply-${j}`,
              type: reactionType
            });
          }
        }

        const reply: Comment = {
          id: `comment-${i}-reply-${j}`,
          content: `This is a reply to comment ${i}. I agree with you!`,
          createdAt: replyDate,
          updatedAt: replyDate,
          eventId,
          replyId: comment.id,
          userId: replyUser.id,
          user: replyUser,
          reactions: replyReactions
        };

        comments.push(reply);
      }
    }
  }

  return comments;
};

type SortOption = 'newest' | 'oldest' | 'popular';

interface EventCommentsProps {
  eventId: string;
}

export const EventComments = ({ eventId }: EventCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyMyComments, setShowOnlyMyComments] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { data: currentUser } = useAuth();

  // Simulate fetching comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockComments = generateMockComments(eventId);
        setComments(mockComments);
        setHasMore(mockComments.length >= 10);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);

  // Handle adding a new comment
  const handleAddComment = async (content: string) => {
    if (!currentUser) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment: Comment = {
        id: `comment-new-${Date.now()}`,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventId,
        replyId: '',
        userId: currentUser.id,
        user: currentUser,
        reactions: []
      };

      setComments((prev) => [newComment, ...prev]);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  // Handle replying to a comment
  const handleReply = async (content: string, replyToId: string) => {
    if (!currentUser) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newReply: Comment = {
        id: `reply-new-${Date.now()}`,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventId,
        replyId: replyToId,
        userId: currentUser.id,
        user: currentUser,
        reactions: []
      };

      setComments((prev) => [...prev, newReply]);
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast.error('Failed to add reply');
    }
  };

  // Handle deleting a comment
  const handleDelete = async (commentId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the comment and its replies
      setComments((prev) => prev.filter((c) => c.id !== commentId && c.replyId !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Handle adding a reaction to a comment
  const handleReaction = async (commentId: string, reactionType: ReactionType) => {
    if (!currentUser) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const reactions = [...(comment.reactions || [])];

            // Check if user already reacted with this type
            const existingReactionIndex = reactions.findIndex(
              (r) => r.userId === currentUser.id && r.type === reactionType
            );

            if (existingReactionIndex >= 0) {
              // Remove existing reaction (toggle off)
              reactions.splice(existingReactionIndex, 1);
              toast.success(`Reaction removed`);
            } else {
              // Remove any other reaction by this user
              const userReactionIndex = reactions.findIndex((r) => r.userId === currentUser.id);
              if (userReactionIndex >= 0) {
                reactions.splice(userReactionIndex, 1);
              }

              // Add new reaction
              reactions.push({
                id: `reaction-${Date.now()}`,
                userId: currentUser.id,
                commentId,
                type: reactionType
              });
              toast.success(`Reaction added: ${reactionType.toLowerCase()}`);
            }

            return { ...comment, reactions };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Failed to add reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  // Handle loading more comments
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nextPage = page + 1;
      const moreComments = generateMockComments(eventId, 5);

      setComments((prev) => [...prev, ...moreComments]);
      setPage(nextPage);
      setHasMore(nextPage < 3); // Limit to 3 pages for demo
    } catch (error) {
      console.error('Failed to load more comments:', error);
      toast.error('Failed to load more comments');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filter comments based on toggle
  const filteredComments = showOnlyMyComments ? comments.filter((c) => c.userId === currentUser?.id) : comments;

  // Sort comments
  const sortedComments = [...filteredComments].sort((a, b) => {
    // Only sort root comments
    if (a.replyId || b.replyId) return 0;

    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.reactions?.length || 0) - (a.reactions?.length || 0);
      default:
        return 0;
    }
  });

  return (
    <Card>
      <CardContent className="gap-4 grid">
        <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 grow">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments
          </CardTitle>
          <div className="flex items-center gap-4 flex-1 *:grow">
            <div className="flex items-center gap-2">
              <Toggle
                pressed={showOnlyMyComments}
                onPressedChange={setShowOnlyMyComments}
                className="min-w-30 rounded-full"
                disabled={!currentUser}>
                {showOnlyMyComments ? 'My Only' : 'All Comments'}
              </Toggle>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
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
        <CommentForm eventId={eventId} onSubmit={handleAddComment} />

        <div className="mt-6">
          <CommentList
            comments={sortedComments}
            isLoading={isLoading}
            onReply={handleReply}
            onDelete={handleDelete}
            onReaction={handleReaction}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            currentUserId={currentUser?.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};
