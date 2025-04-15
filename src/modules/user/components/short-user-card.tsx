'use client';

import { ArrowRight, Calendar, Users } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { UserAvatar } from '@/shared/components/common/user-avatar';

import type { User } from '../interfaces/user.interface';

interface ShortUserCardProps {
  user: User;
  showConnect?: boolean;
  className?: string;
  eventsAttended?: number;
  following?: number;
}

export const ShortUserCard: FC<ShortUserCardProps> = ({ user, eventsAttended = 0, following = 0, className }) => {
  return (
    <Link
      to={`/users/${user.id}`}
      className={`flex gap-3 group hover:bg-muted p-3 rounded-md transition-colors border border-transparent hover:border-primary/20 items-center @container ${className}`}>
      <UserAvatar
        user={user}
        className="size-18 flex-shrink-0 border-2 border-border group-hover:border-primary transition-colors"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <h3 className="font-medium text-base line-clamp-1 group-hover:text-primary transition-colors">{user.name}</h3>

        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {user.bio || `${user.role === 'ADMIN' && 'Administrator'}`}
        </p>

        <div className="flex items-center gap-3 mt-2 @max-[15rem]:hidden">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3 text-primary" />
            <span>{eventsAttended} events</span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="mr-1 h-3 w-3 text-primary" />
            <span>{following} following</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </Link>
  );
};
