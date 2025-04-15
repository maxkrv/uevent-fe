'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Event } from '@/modules/event/interfaces/event.interface';
import { Badge } from '@/shared/components/ui/badge';
import { Pagination } from '@/shared/components/ui/pagination';
import dayjs from '@/shared/lib/dayjs';

interface UserAttendedEventsProps {
  events: Event[];
}

export const UserAttendedEvents = ({ events }: UserAttendedEventsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter only past events (events with end date in the past)
  const pastEvents = events.filter((event) => dayjs(event.endDate || event.startDate).isBefore(dayjs()));

  // Sort events by date (most recent first)
  const sortedEvents = [...pastEvents].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (pastEvents.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-screen-no-header">
        {' '}
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Events Attended</h3>
        <p className="text-muted-foreground">This user hasn&apos;t attended any events yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="bg-card rounded-lg border p-4 hover:border-primary transition-colors group">
            <div className="flex gap-4">
              <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={event.poster || `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(event.title)}`}
                  alt={event.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>

                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="mr-1 h-3 w-3" />
                  {dayjs(event.startDate).format('MMM D, YYYY')}
                </div>

                {event.location && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span className="truncate">{event.location.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
                  </Badge>

                  {event.category && (
                    <Badge variant="secondary" className="text-xs">
                      {event.category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};
