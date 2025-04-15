'use client';

import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, MessageSquare, MoreHorizontal, Reply, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Link } from '../../../shared/components/common/link';
import { UserAvatar } from '../../../shared/components/common/user-avatar';
import { Button } from '../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../shared/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import type { Comment, ReactionType } from '../interfaces/comment.interface';
import { CommentForm } from './comment-form';

// Reaction type to emoji mapping
const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  DISLIKE: '👎',
  LOVE: '❤️',
  LAUGH: '😂',
  SAD: '😢',
  ANGRY: '😡'
};

// All available reaction types
const REACTION_TYPES = Object.keys(REACTION_EMOJIS) as ReactionType[];

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, replyToId: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: ReactionType) => void;
  replies?: Comment[];
  currentUserId?: string;
  isReply?: boolean;
}

export const CommentItem = ({
  comment,
  onReply,
  onDelete,
  onReaction,
  replies = [],
  currentUserId,
  isReply = false
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const reactionButtonRef = useRef<HTMLButtonElement>(null);

  const isAuthor = currentUserId === comment.userId;
  const formattedDate = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : 'recently';

  const hasReplies = replies && replies.length > 0;

  const handleReplySubmit = async (content: string) => {
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  const handleReactionSelect = (reactionType: ReactionType) => {
    onReaction(comment.id, reactionType);
    setIsReactionPickerOpen(false);
  };

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
    setIsReplying(false);
  };

  // Group reactions by type
  const reactionCounts: Record<ReactionType, number> = {
    LIKE: 0,
    DISLIKE: 0,
    LOVE: 0,
    LAUGH: 0,
    SAD: 0,
    ANGRY: 0
  };

  comment.reactions?.forEach((reaction) => {
    reactionCounts[reaction.type]++;
  });

  // Check if current user has reacted
  const userReaction = comment.reactions?.find((r) => r.userId === currentUserId);

  // Get the emoji for the React button
  const reactButtonEmoji = userReaction ? REACTION_EMOJIS[userReaction.type] : '😊';

  return (
    <div className="animate-in fade-in-50 duration-300">
      <div className="flex gap-3">
        <Link to={`/users/${comment.userId}`} unstyled>
          <UserAvatar
            user={comment.user!}
            className={`flex-shrink-0 hidden sm:block hover:border-primary ${isReply ? 'h-8 w-8' : 'h-10 w-10'}`}
          />
        </Link>

        <div className="flex-1 gap-1 min-w-0 grid">
          <div className={`bg-card border rounded-lg ${isReply ? 'p-3' : 'p-3 pt-1'} shadow-sm grid gap-2`}>
            <div className="flex justify-between items-center">
              <Link to={`/users/${comment.userId}`} className="flex items-center gap-2 p-0 h-min">
                <UserAvatar
                  user={comment.user!}
                  className="h-6 w-6 flex-shrink-0 sm:hidden block hover:border-primary"
                />
                <h4 className="font-semibold text-sm">{comment.user?.name || 'Anonymous'}</h4>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </Link>

              <div className="flex items-center">
                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={`rounded-full ${isReply ? 'h-7 w-7' : 'h-8 w-8'}`}>
                        <MoreHorizontal className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(comment.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${isReply ? 'h-7 w-7' : 'h-8 w-8'}`}
                  onClick={() => setIsCollapsed(!isCollapsed)}>
                  {isCollapsed ? (
                    <ChevronDown className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                  ) : (
                    <ChevronUp className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                  )}
                </Button>
              </div>
            </div>

            {!isCollapsed && (
              <p className={`text-sm whitespace-pre-line ${isReply ? 'mt-1' : ''}`}>{comment.content}</p>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex flex-wrap items-center gap-1 pl-1">
                {/* Reaction counts */}
                {comment.reactions && comment.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mr-2">
                    {Object.entries(reactionCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([type, count]) => (
                        <Button
                          key={type}
                          variant={userReaction?.type === type ? 'default' : 'outline'}
                          size="sm"
                          className={`px-2 text-xs rounded-full ${isReply ? 'h-6' : 'h-7'} ${
                            userReaction?.type === type ? 'bg-primary/20' : 'bg-muted/50'
                          }`}
                          onClick={() => onReaction(comment.id, type as ReactionType)}>
                          {REACTION_EMOJIS[type as ReactionType]} {count}
                        </Button>
                      ))}
                  </div>
                )}

                {/* Add reaction button */}
                <Popover open={isReactionPickerOpen} onOpenChange={setIsReactionPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={reactionButtonRef}
                      variant="ghost"
                      size="sm"
                      className={`text-xs rounded-full hover:bg-muted ${isReply ? 'h-6' : 'h-7'}`}>
                      {reactButtonEmoji} React
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start" side="top">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {REACTION_TYPES.map((type) => (
                        <button
                          key={type}
                          className={`${isReply ? 'text-lg' : 'text-xl'} p-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                            userReaction?.type === type ? 'bg-primary/20' : ''
                          }`}
                          onClick={() => handleReactionSelect(type)}
                          title={type.toLowerCase()}>
                          {REACTION_EMOJIS[type]}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Reply button with count - only show for non-replies */}
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs rounded-full hover:bg-muted"
                    onClick={hasReplies ? handleToggleReplies : () => setIsReplying(!isReplying)}>
                    <Reply className="h-3.5 w-3.5 mr-1" />
                    {hasReplies ? `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}` : 'Reply'}
                  </Button>
                )}
              </div>

              {/* Reply form when no replies exist */}
              {isReplying && !hasReplies && !isReply && (
                <CommentForm
                  eventId={comment.eventId}
                  replyToId={comment.id}
                  onSubmit={handleReplySubmit}
                  onCancel={() => setIsReplying(false)}
                  placeholder="Write a reply..."
                  autoFocus
                  isReply
                />
              )}

              {/* Replies section - only for non-replies */}
              {hasReplies && !isReply && (
                <div className="mt-3 pl-4 border-l-2 border-muted">
                  {!showReplies ? (
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-muted" onClick={handleToggleReplies}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </Button>
                  ) : (
                    <>
                      {/* Reply form when showing replies */}
                      <CommentForm
                        eventId={comment.eventId}
                        replyToId={comment.id}
                        onSubmit={handleReplySubmit}
                        onCancel={() => setIsReplying(false)}
                        placeholder="Write a reply..."
                        isReply
                      />

                      <div className="space-y-4 mt-4">
                        {replies.map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            onDelete={onDelete}
                            onReaction={onReaction}
                            onReply={onReply}
                            currentUserId={currentUserId}
                            isReply={true}
                          />
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs mt-2 hover:bg-muted"
                        onClick={handleToggleReplies}>
                        Hide replies
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
