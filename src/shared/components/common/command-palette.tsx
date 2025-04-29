'use client';

import {
  Bell,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarHeart,
  CalendarPlus,
  CircleUser,
  Compass,
  Filter,
  Heart,
  History,
  Home,
  KeyRound,
  Lock,
  LogIn,
  Map,
  Newspaper,
  Search,
  Settings,
  Star,
  Ticket,
  TrendingUp,
  UserCog,
  UserPlus,
  Zap
} from 'lucide-react';
import type React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '../ui/command';

// Define all navigation items grouped by category
const navigationGroups: NavigationGroup[] = [
  {
    name: 'Main Navigation',
    items: [
      {
        icon: Home,
        name: 'Home',
        path: '/',
        description: 'Return to the homepage',
        keywords: ['main', 'start', 'landing']
      },
      {
        icon: Calendar,
        name: 'Events',
        path: '/events',
        description: 'Browse all events',
        keywords: ['all', 'browse', 'discover']
      },
      {
        icon: Building2,
        name: 'Companies',
        path: '/companies',
        description: 'Browse all companies',
        keywords: ['organizations', 'business', 'browse']
      },
      {
        icon: CircleUser,
        name: 'My Profile',
        path: '/profile',
        description: 'View your profile',
        keywords: ['account', 'me', 'personal']
      }
    ]
  },
  {
    name: 'Events',
    items: [
      {
        icon: Search,
        name: 'Find Events',
        path: '/events',
        description: 'Search for events',
        keywords: ['search', 'discover', 'find']
      },
      {
        icon: Map,
        name: 'Events Map',
        path: '/events?view=map',
        description: 'View events on a map',
        keywords: ['location', 'nearby', 'geographic']
      },
      {
        icon: Filter,
        name: 'Filter Events',
        path: '/events?filter=true',
        description: 'Filter events by criteria',
        keywords: ['search', 'criteria', 'sort']
      },
      {
        icon: CalendarPlus,
        name: 'Create Event',
        path: '/events/create',
        description: 'Create a new event',
        keywords: ['new', 'add', 'organize']
      },
      {
        icon: TrendingUp,
        name: 'Popular Events',
        path: '/events?sort=popular',
        description: 'View popular events',
        keywords: ['trending', 'hot', 'featured']
      },
      {
        icon: CalendarClock,
        name: 'Upcoming Events',
        path: '/events?timeframe=upcoming',
        description: 'View upcoming events',
        keywords: ['future', 'soon', 'scheduled']
      },
      {
        icon: CalendarCheck,
        name: 'Past Events',
        path: '/events?timeframe=past',
        description: 'View past events',
        keywords: ['previous', 'completed', 'history']
      },
      {
        icon: CalendarHeart,
        name: 'Followed Events',
        path: '/events?filter=followed',
        description: 'View events you follow',
        keywords: ['saved', 'bookmarked', 'favorite']
      }
    ]
  },
  {
    name: 'Companies',
    items: [
      {
        icon: Search,
        name: 'Find Companies',
        path: '/companies',
        description: 'Search for companies',
        keywords: ['search', 'discover', 'organizations']
      },
      {
        icon: Building,
        name: 'Create Company',
        path: '/companies/create',
        description: 'Create a new company',
        keywords: ['new', 'add', 'register']
      },
      {
        icon: Star,
        name: 'Featured Companies',
        path: '/companies?filter=featured',
        description: 'View featured companies',
        keywords: ['popular', 'highlighted', 'promoted']
      },
      {
        icon: Newspaper,
        name: 'Company News',
        path: '/companies/news',
        description: 'View latest company news',
        keywords: ['updates', 'articles', 'press']
      },
      {
        icon: Heart,
        name: 'Followed Companies',
        path: '/companies?filter=followed',
        description: 'View companies you follow',
        keywords: ['saved', 'bookmarked', 'favorite']
      }
    ]
  },
  {
    name: 'Your Profile',
    items: [
      {
        icon: CalendarClock,
        name: 'Your Upcoming Events',
        path: '/users/me/upcoming',
        description: "Events you're attending",
        keywords: ['my', 'attending', 'future']
      },
      {
        icon: History,
        name: 'Your Past Events',
        path: '/users/me/past',
        description: "Events you've attended",
        keywords: ['my', 'history', 'previous']
      },
      {
        icon: Heart,
        name: 'Following',
        path: '/users/me/following/companies',
        description: 'Companies you follow',
        keywords: ['subscribed', 'saved', 'favorite']
      },
      {
        icon: CalendarHeart,
        name: 'Following Events',
        path: '/users/me/following/events',
        description: 'Events you follow',
        keywords: ['subscribed', 'saved', 'favorite']
      },
      {
        icon: Ticket,
        name: 'Your Tickets',
        path: '/users/me/tickets',
        description: 'View your tickets',
        keywords: ['my', 'passes', 'bookings']
      },
      {
        icon: Settings,
        name: 'Settings',
        path: '/users/me/settings',
        description: 'Manage your account',
        keywords: ['preferences', 'account', 'profile']
      },
      {
        icon: UserCog,
        name: 'Profile Settings',
        path: '/users/me/settings?tab=profile',
        description: 'Edit your profile',
        keywords: ['edit', 'personal', 'information']
      },
      {
        icon: Bell,
        name: 'Notification Settings',
        path: '/users/me/settings?tab=notifications',
        description: 'Manage notifications',
        keywords: ['alerts', 'preferences', 'email']
      },
      {
        icon: Lock,
        name: 'Privacy Settings',
        path: '/users/me/settings?tab=privacy',
        description: 'Manage privacy',
        keywords: ['security', 'visibility', 'personal']
      }
    ]
  },
  {
    name: 'Authentication',
    items: [
      {
        icon: LogIn,
        name: 'Login',
        path: '/auth/login',
        description: 'Sign in to your account',
        keywords: ['signin', 'access', 'account']
      },
      {
        icon: UserPlus,
        name: 'Sign Up',
        path: '/auth/sign-up',
        description: 'Create a new account',
        keywords: ['register', 'create', 'account']
      },
      {
        icon: KeyRound,
        name: 'Forgot Password',
        path: '/auth/forgot-password',
        description: 'Reset your password',
        keywords: ['reset', 'recover', 'password']
      }
    ]
  }
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavigationItem {
  icon: React.ElementType;
  name: string;
  path: string;
  description?: string;
  keywords?: string[];
}

interface NavigationGroup {
  name: string;
  items: NavigationItem[];
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  // Get current section based on path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/events')) return 'Events';
    if (path.includes('/companies')) return 'Companies';
    if (path.includes('/users')) return 'Your Profile';
    if (path.includes('/auth')) return 'Authentication';
    return 'Main Navigation';
  };

  const currentSection = getCurrentSection();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="min-h-100 h-full grid">
        <CommandEmpty className="flex flex-col items-center justify-center min-h-full">
          <div className="flex flex-col items-center justify-center py-6">
            <Compass className="size-20 text-muted-foreground opacity-20" />
            <p className="mt-2 text-muted-foreground">No results found.</p>
          </div>
        </CommandEmpty>

        {/* Current section first */}
        {navigationGroups.map((group) =>
          group.name === currentSection ? (
            <CommandGroup key={group.name} heading={`${group.name} (Current)`} className="text-">
              {group.items.map((item) => (
                <CommandItem
                  key={`${group.name}-${item.path}`}
                  onSelect={() => handleSelect(item.path)}
                  className="flex cursor-pointer items-center">
                  <div className="mr-2 flex items-center justify-center rounded-md bg-primary p-2">
                    <item.icon className="size-4 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                  </div>
                  <CommandShortcut>
                    <Zap className="h-3 w-3" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null
        )}

        <CommandSeparator />

        {/* Other sections */}
        {navigationGroups.map((group) =>
          group.name !== currentSection ? (
            <CommandGroup key={group.name} heading={group.name}>
              {group.items.map((item) => (
                <CommandItem
                  key={`${group.name}-${item.path}`}
                  onSelect={() => handleSelect(item.path)}
                  className="flex cursor-pointer items-center">
                  <div className="mr-2 flex items-center justify-center rounded-md border-2 p-2">
                    <item.icon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null
        )}
      </CommandList>
    </CommandDialog>
  );
}
