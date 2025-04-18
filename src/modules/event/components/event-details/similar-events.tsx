'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../../shared/constants/query-keys';
import type { Event } from '../../interfaces/event.interface';
import { EventService } from '../../services/event.service';
import { ShortEventCard } from '../short-event-card';

interface SimilarEventsProps {
  event: Event;
}

export const SimilarEvents = ({ event }: SimilarEventsProps) => {
  const { data: relatedEvents, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, event.format, 'related'],
    queryFn: () => EventService.getMany({ format: [event.format], limit: 5 })
  });

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

  if (relatedEvents?.items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedEvents?.items.map((event) => (
          <ShortEventCard key={event.id} event={event} className="border-transparent" />
        ))}
      </CardContent>
    </Card>
  );
};
