'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';

import type { Event } from '@/modules/event/interfaces/event.interface';
import { Pagination } from '@/shared/components/ui/pagination';
import dayjs from '@/shared/lib/dayjs';

import { ShortEventCard } from '../../../event/components/short-event-card';

interface UserUpcomingEventsProps {
  events: Event[];
}

export const UserUpcomingEvents = ({ events }: UserUpcomingEventsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter only upcoming events (events with start date in the future)
  const upcomingEvents = events.filter((event) => dayjs(event.startDate).isAfter(dayjs()));

  // Sort events by date (soonest first)
  const sortedEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-screen-no-header">
        {' '}
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
        <p className="text-muted-foreground">This user hasn&apos;t registered for any upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedEvents.map((event) => (
          <ShortEventCard event={event} key={event.id} />
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
