'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import dayjs from '@/shared/lib/dayjs';

import type { Event } from '../../../event/interfaces/event.interface';

interface CompanyEventsProps {
  events: Event[];
  companyId: string;
}

export const CompanyEvents = ({ events, companyId }: CompanyEventsProps) => {
  const nav = useNavigate();

  // Get upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // Get past events
  const pastEvents = events
    .filter((event) => new Date(event.startDate) <= new Date())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  return (
    <>
      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
              <Button variant="outline" className="w-full" onClick={() => nav(`/events?organizer=${companyId}`)}>
                View All Events
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming events scheduled.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Past Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <PastEventItem key={event.id} event={event} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

interface EventItemProps {
  event: Event;
}

const EventItem = ({ event }: EventItemProps) => {
  const nav = useNavigate();

  return (
    <div
      className="flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
      onClick={() => nav(`/events/${event.id}`)}>
      <div className="h-16 w-24 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={
            event.poster ||
            `/placeholder.svg?height=64&width=96&query=${encodeURIComponent(event.title) || '/placeholder.svg'}`
          }
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="mr-1 h-3 w-3" />
          {dayjs(event.startDate).format('MMM D, YYYY • h:mm A')}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
          </Badge>
          {event.location && (
            <span className="text-xs text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {event.location.address}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface PastEventItemProps {
  event: Event;
}

const PastEventItem = ({ event }: PastEventItemProps) => {
  const nav = useNavigate();

  return (
    <div
      className="flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer opacity-80 hover:opacity-100"
      onClick={() => nav(`/events/${event.id}`)}>
      <div className="h-16 w-24 rounded-md overflow-hidden flex-shrink-0 grayscale hover:grayscale-0 transition-all">
        <img
          src={
            event.poster ||
            `/placeholder.svg?height=64&width=96&query=${encodeURIComponent(event.title) || '/placeholder.svg'}`
          }
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="mr-1 h-3 w-3" />
          {dayjs(event.startDate).format('MMM D, YYYY')}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            Past Event
          </Badge>
        </div>
      </div>
    </div>
  );
};
