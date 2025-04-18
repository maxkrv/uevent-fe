'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';
import { NotFoundPage } from '@/shared/pages/not-found-page';

import { UserAttendedEvents } from '../components/user-profile/user-attended-events';
import { UserCompanies } from '../components/user-profile/user-companies';
import { UserFollowing } from '../components/user-profile/user-following';
import { UserProfileHeader } from '../components/user-profile/user-profile-header';
import { UserTickets } from '../components/user-profile/user-tickets';
import { UserUpcomingEvents } from '../components/user-profile/user-upcoming-events';
import { UserService } from '../services/user.service';

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: currentUser } = useAuth();

  const isOwnProfile = currentUser?.id === id;

  // Fetch user data
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError
  } = useQuery({
    queryKey: [QueryKeys.USERS, id],
    queryFn: () => UserService.getById(id!),
    enabled: !!id
  });

  // Fetch user's attended events
  const { data: attendedEventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: [QueryKeys.USER_EVENTS, id],
    queryFn: () => UserService.getAttendedEvents(id!),
    enabled: !!id && !!user
  });

  // Get tab from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['upcoming', 'past', 'following', 'tickets'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  const isLoading = isUserLoading || isEventsLoading;

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (userError || !user) {
    return <NotFoundPage />;
  }

  const attendedEvents = attendedEventsData?.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileHeader user={user} isOwnProfile={isOwnProfile} />
          <UserCompanies userId={user.id} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Past Events
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                Following
              </TabsTrigger>
              {isOwnProfile && (
                <TabsTrigger value="tickets" className="flex-1">
                  Tickets
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="upcoming">
              <UserUpcomingEvents events={attendedEvents} />
            </TabsContent>

            <TabsContent value="past">
              <UserAttendedEvents events={attendedEvents} />
            </TabsContent>

            <TabsContent value="following">
              <UserFollowing userId={user.id} />
            </TabsContent>

            {isOwnProfile && (
              <TabsContent value="tickets">
                <UserTickets userId={user.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const UserProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-64 mb-2" />
            <Skeleton className="h-4 w-56 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="lg:col-span-2">
        <Skeleton className="h-10 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
