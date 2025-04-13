'use client';

import { useEffect, useState } from 'react';
import { FiSliders } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { mockEvents } from '../../../__mock__/events';
import type { Event } from '../../event/interfaces/event.interface';
import { EventCard } from '../components/event.card';
import { EventFilters } from '../components/event-filters';
import { EventsView, EventViewToggle } from '../components/event-view-toggle';
import { EventsDisplay } from '../components/events-display';
import { EventsSearch } from '../components/events-search';
import { EventsSort, type SortOption } from '../components/events-sort';

export const EventsPage = () => {
  const [viewMode, setViewMode] = useState<EventsView>(EventsView.GRID);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!events.length) return;

    let filtered = [...events];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = sortEvents(filtered, sortOption);

    setFilteredEvents(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchQuery, events, sortOption]);

  const sortEvents = (eventsToSort: Event[], option: SortOption): Event[] => {
    const sorted = [...eventsToSort];
    switch (option) {
      case 'date':
        return sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const handleFilterChange = (filtered: Event[]) => {
    // We need to make sure we're not causing a loop by setting filteredEvents
    // which might trigger other effects that update filters
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get a featured event (just using the first one for demo)
  const featuredEvent = events[0];

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto md:p-8 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
        <p className="text-muted-foreground">Find and join exciting events happening around you</p>
      </div>

      {/* Featured Event */}
      {!isLoading && featuredEvent && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Featured Event</h2>
          </div>
          <EventCard event={featuredEvent} />
        </div>
      )}

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <EventsSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        <div className="flex gap-2 justify-between items-center flex-wrap">
          <EventsSort sortOption={sortOption} onSortChange={handleSortChange} />

          <EventViewToggle view={viewMode} setView={setViewMode} />

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-primary-light')}>
            <FiSliders className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'mb-6 p-4 bg-accent rounded-lg animate-in fade-in-0 zoom-in-95 duration-200',
          showFilters ? 'block' : 'hidden'
        )}>
        {/* Filters */}
        <EventFilters events={events} onFilterChange={handleFilterChange} />
      </div>

      {/* Events Display */}
      <EventsDisplay
        events={paginatedEvents}
        isLoading={isLoading}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
