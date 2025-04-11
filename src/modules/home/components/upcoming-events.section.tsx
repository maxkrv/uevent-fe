import type React from 'react';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Link } from '../../../shared/components/common/link';
import { Button } from '../../../shared/components/ui/button';
import { cn } from '../../../shared/lib/utils';
import { Event, EventFormat } from '../../event/interfaces/event.interface';
import { EventCard } from './event.card';
// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference with industry leaders',
    poster:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-09-15T09:00:00Z',
    endDate: '2023-09-17T18:00:00Z',
    location: {
      address: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    price: 99.99,
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.CONFERENCE,
    company: {
      id: '1',
      name: 'TechCorp',
      logo: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'Three days of amazing music performances',
    poster:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-07-20T16:00:00Z',
    endDate: '2023-07-23T23:00:00Z',
    location: {
      address: 'Austin, TX',
      latitude: 30.2672,
      longitude: -97.7431
    },
    price: 149.99,
    category: { id: '2', name: 'Music', description: 'Music related events' },
    format: EventFormat.FESTIVAL,
    company: {
      id: '2',
      name: 'SoundWave Productions',
      logo: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: '3',
    title: 'Art Exhibition: Modern Masters',
    description: 'Featuring works from contemporary artists',
    poster:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-08-10T10:00:00Z',
    endDate: '2023-09-10T18:00:00Z',
    location: {
      address: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.006
    },
    price: 25,
    category: { id: '3', name: 'Arts', description: 'Arts and culture events' },
    format: EventFormat.LECTURE,
    company: {
      id: '3',
      name: 'Metropolitan Gallery',
      logo: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description: 'Entrepreneurs pitch their ideas to investors',
    poster:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-06-30T18:00:00Z',
    endDate: '2023-06-30T21:00:00Z',
    location: {
      address: 'Boston, MA',
      latitude: 42.3601,
      longitude: -71.0589
    },
    price: 0,
    category: { id: '1', name: 'Business', description: 'Business related events' },
    format: EventFormat.OTHER,
    company: {
      id: '4',
      name: 'Venture Accelerator',
      logo: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    description: 'Taste the best local and international cuisine',
    poster:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    startDate: '2023-10-05T12:00:00Z',
    endDate: '2023-10-08T22:00:00Z',
    location: {
      address: 'Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298
    },
    price: 75,
    category: { id: '4', name: 'Food & Drink', description: 'Culinary events' },
    format: EventFormat.FESTIVAL,
    company: {
      id: '5',
      name: 'Gourmet Events',
      logo: 'https://randomuser.me/api/portraits/women/5.jpg'
    }
  },
  {
    id: '6',
    title: 'Charity Marathon',
    description: 'Run for a cause and help raise funds',
    poster:
      'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    startDate: '2023-09-24T07:00:00Z',
    endDate: '2023-09-24T13:00:00Z',
    location: {
      address: 'Seattle, WA',
      latitude: 47.6062,
      longitude: -122.3321
    },
    price: 35,
    category: { id: '5', name: 'Sports', description: 'Sports and fitness events' },
    format: EventFormat.WORKSHOP,
    company: {
      id: '6',
      name: 'HealthFirst Foundation',
      logo: 'https://randomuser.me/api/portraits/men/6.jpg'
    }
  }
];

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
        <Link to="/events" className="text-xl font-semibold" withArrow>
          View All Events
        </Link>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
