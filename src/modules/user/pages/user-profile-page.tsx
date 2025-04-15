'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { mockEvents } from '@/__mock__/events';
import { mockUsers } from '@/__mock__/users';
import { useAuth } from '@/modules/auth/queries/use-auth.query';
import type { Event } from '@/modules/event/interfaces/event.interface';
import type { User } from '@/modules/user/interfaces/user.interface';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { NotFoundPage } from '@/shared/pages/not-found-page';

import { UserAttendedEvents } from '../components/user-profile/user-attended-events';
import { UserCompanies } from '../components/user-profile/user-companies';
import { UserFollowing } from '../components/user-profile/user-following';
import { UserProfileHeader } from '../components/user-profile/user-profile-header';
import { UserTickets } from '../components/user-profile/user-tickets';
import { UserUpcomingEvents } from '../components/user-profile/user-upcoming-events';

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: currentUser } = useAuth();

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Find user by ID
        const foundUser = mockUsers.find((u) => u.id === id);
        setUser(foundUser || null);

        // Get events this user has attended
        // In a real app, this would be a separate API call
        if (foundUser) {
          const userEvents = mockEvents.filter((event) =>
            event.attendees?.some((attendee) => attendee.id === foundUser.id)
          );
          setAttendedEvents(userEvents);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileHeader user={user} isOwnProfile={isOwnProfile} attendedEventsCount={attendedEvents.length} />
          <UserCompanies userId={user.id} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
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
                <UserTickets events={attendedEvents} />
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
