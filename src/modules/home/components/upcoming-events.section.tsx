'use client';

import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Link } from '../../../shared/components/common/link';
import { Button } from '../../../shared/components/ui/button';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { cn } from '../../../shared/lib/utils';
import { EventCard } from '../../event/components/event.card';
import { EventThemeType } from '../../event/interfaces/event.interface';
import { EventGetManyDto, EventService } from '../../event/services/event.service';

const UpcomingEventsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Define filters
  const filters = [
    { id: 'all', name: 'All Events' },
    { id: 'today', name: 'Today' },
    { id: 'weekend', name: 'This Weekend' },
    { id: 'free', name: 'Free' },
    { id: 'music', name: 'Music' },
    { id: 'business', name: 'Business' }
  ];

  // Fetch events with React Query
  const { data: eventsData, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, 'upcoming', activeFilter, currentPage, pageSize],
    queryFn: async () => {
      // Create filter options based on active filter
      const filterOptions: EventGetManyDto = {
        page: currentPage,
        limit: pageSize
      };

      // Apply specific filters based on selection
      if (activeFilter === 'today') {
        const today = new Date();
        filterOptions.startDate = today;
        filterOptions.endDate = new Date(today.setHours(23, 59, 59, 999));
      } else if (activeFilter === 'weekend') {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + 7 - dayOfWeek;
        const friday = new Date(today);
        friday.setDate(today.getDate() + daysUntilFriday);
        friday.setHours(0, 0, 0, 0);

        const sunday = new Date(friday);
        sunday.setDate(friday.getDate() + 2);
        sunday.setHours(23, 59, 59, 999);

        filterOptions.startDate = friday;
        filterOptions.endDate = sunday;
      } else if (activeFilter === 'free') {
        filterOptions.priceFrom = 0;
        filterOptions.priceTo = 0;
      } else if (activeFilter === 'music') {
        filterOptions.themes = [EventThemeType.MUSIC];
      } else if (activeFilter === 'business') {
        filterOptions.themes = [EventThemeType.BUSINESS];
      }

      return await EventService.getMany(filterOptions);
    }
  });

  const totalPages = eventsData?.meta.totalPages || 1;

  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">Discover events that match your interests</p>
        </div>

        <div className="mt-4 md:mt-0 items-center hidden md:flex">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50">
              <FiChevronLeft />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-8 overflow-x-auto scrollbar-hide`}>
        <div className="flex gap-2 pb-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentPage(1);
              }}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300',
                activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-primary-light'
              )}>
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
          {eventsData?.items.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}

      {/* Mobile pagination */}
      <div className="mt-8 flex justify-center md:hidden">
        <div className="flex items-center space-x-2">
          <Button
            size={'icon'}
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}>
            <FiChevronLeft />
          </Button>

          <span className="text-accent-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            size={'icon'}
            variant="outline">
            <FiChevronRight />
          </Button>
        </div>
      </div>

      {/* View all button */}
      <div className="mt-8 text-center">
        <Link to="/events" className="text-xl font-semibold" withArrowRight>
          View All Events
        </Link>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
