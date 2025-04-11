import { FC } from 'react';

import { User } from '../../../modules/user/interfaces/user.interface';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserAvatarProps {
  user: User | null;
  className?: string;
}
const getInitials = (fullName?: string) => {
  if (!fullName) return '';

  return (
    fullName
      .split(' ') // Split by space
      .filter(Boolean) // Remove empty strings
      .map((name) => name[0].toUpperCase()) // Take first character, capitalize
      .slice(0, 2) // Take first two initials
      .join('') || ''
  ); // Join into initials
};
export const UserAvatar: FC<UserAvatarProps> = ({ className, user }) => {
  return (
    <Avatar className={cn('bg-muted border-2', className)}>
      <AvatarImage src={user?.avatar || ''} />
      <AvatarFallback className="uppercase">{!user?.avatar && `${getInitials(user?.name)}`}</AvatarFallback>
    </Avatar>
  );
};
