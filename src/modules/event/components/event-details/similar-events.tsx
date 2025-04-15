'use client';

import { useEffect, useState } from 'react';

import { mockEvents } from '@/__mock__/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import type { Event } from '../../interfaces/event.interface';
import { ShortEventCard } from '../short-event-card';

interface SimilarEventsProps {
  currentEventId: string;
  categoryId?: string;
}

export const SimilarEvents = ({ currentEventId, categoryId }: SimilarEventsProps) => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Filter events by category and exclude current event
        let filtered = mockEvents.filter((event) => event.id !== currentEventId);

        if (categoryId) {
          filtered = filtered.filter((event) => event.category?.id === categoryId);
        }

        // Limit to 3 events
        setRelatedEvents(filtered.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch related events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currentEventId, categoryId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedEvents.map((event) => (
          <ShortEventCard key={event.id} event={event} className="border-transparent" />
        ))}
      </CardContent>
    </Card>
  );
};
