'use client';

import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { mockEvents } from '@/__mock__/events';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import type { Event } from '../../interfaces/event.interface';
import { ShortEventCard } from '../short-event-card';

interface CompanyEventsProps {
  currentEventId: string;
  companyId?: string;
}

export const CompanyEvents: FC<CompanyEventsProps> = ({ currentEventId, companyId }) => {
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Filter events by company and exclude current event
        if (companyId) {
          const filtered = mockEvents
            .filter((event) => event.id !== currentEventId && event.company?.id === companyId)
            .slice(0, 3);
          setOrganizerEvents(filtered);
        } else {
          setOrganizerEvents([]);
        }
      } catch (error) {
        console.error('Failed to fetch organizer events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, [currentEventId, companyId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>More from this Organizer</CardTitle>
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

  if (organizerEvents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">More from this Company</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {organizerEvents.map((event) => (
          <ShortEventCard key={event.id} event={event} className="border-transparent" />
        ))}

        {companyId && (
          <Link to={`/companies/${companyId}`} className="block w-full">
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
