import { useMemo } from 'react';

import { EventCard } from '@/modules/event/components/event.card';
import { EventsView } from '@/modules/event/components/event-view-toggle';
import { EventsMap } from '@/modules/event/components/events-map';
import { NoEventsFound } from '@/modules/event/components/no-events-found';
import type { Event } from '@/modules/event/interfaces/event.interface';
import { Pagination, PaginationResultsInfo } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface EventsDisplayProps {
  events: Event[];
  isLoading: boolean;
  viewMode: EventsView;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const EventsDisplay = ({
  events,
  isLoading,
  viewMode,
  currentPage,
  totalPages,
  pageSize,
  onPageChange
}: EventsDisplayProps) => {
  // Use useMemo to prevent unnecessary re-renders
  const displayEvents = useMemo(() => events, [events]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-secondary rounded-xl overflow-hidden shadow h-96">
            <Skeleton className="h-1/3 w-full" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <NoEventsFound />;
  }

  return (
    <div className="space-y-8">
      {viewMode === EventsView.GRID && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {displayEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {viewMode === EventsView.LIST && (
        <div className="space-y-8">
          {displayEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {viewMode === EventsView.MAP && (
        <div className="h-150 rounded-lg overflow-hidden">
          <EventsMap events={displayEvents} />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <PaginationResultsInfo currentPage={currentPage} pageSize={pageSize} totalItems={totalPages * pageSize} />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
};
