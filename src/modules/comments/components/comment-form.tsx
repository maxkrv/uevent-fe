'use client';

import { Send, Smile } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';

import { cn } from '../../../shared/lib/utils';

// Common emoji categories
const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '🙏', '🤲'] },
  { name: 'Love', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕'] },
  { name: 'Celebration', emojis: ['🎉', '🎊', '🎈', '🎂', '🎁', '🎆', '🎇', '✨', '🎃', '🎄'] }
];

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  isReply?: boolean;
  isSubmitting?: boolean;
}

export const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = 'Share your thoughts about this event...',
  autoFocus = false,
  isReply = false,
  isSubmitting = false
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { data: user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-muted-foreground">Please log in to leave a comment</p>
        <Button variant="link" className="mt-2" onClick={() => (window.location.href = '/auth/login')}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'mt-2' : 'mt-6'}`}>
      <div className="flex gap-3">
        <UserAvatar user={user} className={cn('size-10 flex-shrink-0 mt-1', isReply && 'size-8')} />
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none"
              autoFocus={autoFocus}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="h-8 rounded-full" disabled={isSubmitting}>
                  <Smile className="h-4 w-4 mr-1" />
                  Add Emoji
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start" side="top">
                <div className="space-y-3 max-h-55 overflow-y-auto">
                  {EMOJI_CATEGORIES.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">{category.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="text-xl p-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors"
                            onClick={() => {
                              insertEmoji(emoji);
                              setIsEmojiPickerOpen(false);
                            }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex gap-2 ml-auto">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="gap-2"
                size={isReply ? 'sm' : 'default'}
                isLoading={isSubmitting}>
                {!isSubmitting && <Send className="h-4 w-4" />}
                {isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
