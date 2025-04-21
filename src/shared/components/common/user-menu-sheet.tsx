'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, LogOut, Settings, Ticket, UserCog, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth, userGroupOptions } from '@/modules/auth/queries/use-auth.query';
import { AuthService } from '@/modules/auth/services/auth.service';
import { useTokens } from '@/modules/auth/stores/tokens.store';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';

import { UserAvatar } from './user-avatar';

const USER_MENU_OPTIONS = [
  { name: 'My Profile', icon: UserIcon, path: '' },
  { name: 'My Events', icon: CalendarClock, path: '/upcoming' },
  { name: 'My Tickets', icon: Ticket, path: '/tickets' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export const UserMenuSheet = () => {
  const [open, setOpen] = useState(false);
  const { data: user } = useAuth();
  const tokens = useTokens();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = useMutation({
    mutationFn: () => {
      return AuthService.logout(tokens.tokens?.refreshToken || '');
    },
    onSuccess: () => {
      tokens.deleteTokens();
      queryClient.resetQueries(userGroupOptions());
      navigate('/');
      toast.success('Logged out successfully');
      setOpen(false);
    }
  });

  if (!user) return null;

  const navigateTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 hover:border-0 border-0">
          <UserAvatar
            user={user}
            className="border-2  size-full hover:border-primary transition-colors cursor-pointer"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 flex flex-col gap-4" aria-describedby="user-menu">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3 ">
            <UserAvatar user={user} className="h-12 w-12" />
            <div>
              <SheetTitle>{user.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {USER_MENU_OPTIONS.map((option) => (
            <Button
              key={option.name}
              variant="ghost"
              className="justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => navigateTo(`/users/${user.id}${option.path}`)}>
              <option.icon className="mr-2 h-5 w-5" />
              {option.name}
            </Button>
          ))}
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => navigateTo('/admin')}>
            <UserCog className="mr-2 h-5 w-5" />
            Admin Panel
          </Button>
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}>
            <LogOut className="mr-2 h-5 w-5" />
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
