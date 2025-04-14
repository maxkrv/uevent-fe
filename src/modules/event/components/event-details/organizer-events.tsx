'use client';

import { ArrowRight, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { mockEvents } from '@/__mock__/events';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import dayjs from '@/shared/lib/dayjs';

import type { Event } from '../../interfaces/event.interface';

interface OrganizerEventsProps {
  currentEventId: string;
  companyId?: string;
}

export const OrganizerEvents = ({ currentEventId, companyId }: OrganizerEventsProps) => {
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
        <CardTitle className="text-xl">More from this Organizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {organizerEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors">
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 relative">
              <img
                src={event.poster || '/placeholder.svg?height=64&width=64'}
                alt={event.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Calendar className="mr-1 h-3 w-3" />
                {dayjs(event.startDate).format('MMM D, YYYY')}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
                </Badge>
              </div>
            </div>
            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </Link>
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
