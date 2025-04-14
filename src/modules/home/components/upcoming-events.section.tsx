import type React from 'react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { mockEvents } from '../../../__mock__/events';
import { Link } from '../../../shared/components/common/link';
import { Button } from '../../../shared/components/ui/button';
import { cn } from '../../../shared/lib/utils';
import { EventCard } from '../../event/components/event.card';

const UpcomingEventsSection: React.FC = () => {
  const totalPages = 3; // Mock total pages for pagination
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = [
    { id: 'all', name: 'All Events' },
    { id: 'today', name: 'Today' },
    { id: 'weekend', name: 'This Weekend' },
    { id: 'free', name: 'Free' },
    { id: 'music', name: 'Music' },
    { id: 'business', name: 'Business' }
  ];

  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upcoming Events</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover events that match your interests</p>
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
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300',
                activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-primary-light'
              )}>
              {filter.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

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
