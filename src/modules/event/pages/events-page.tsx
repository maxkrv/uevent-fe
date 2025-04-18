'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiSliders } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { ActiveFilters } from '../components/active-filters';
import { EventCard } from '../components/event.card';
import { EventFilters } from '../components/event-filters';
import { EventsView, EventViewToggle } from '../components/event-view-toggle';
import { EventsDisplay } from '../components/events-display';
import { EventsSearch } from '../components/events-search';
import { EventsSort, type SortOption } from '../components/events-sort';
import { type EventGetManyDto, EventService } from '../services/event.service';

const EVENTS_PER_PAGE = 10;

export const EventsPage = () => {
  const [viewMode, setViewMode] = useState<EventsView>(EventsView.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [filters, setFilters] = useState<EventGetManyDto>({});

  // Combine search query with filters
  const queryFilters = {
    ...filters,
    search: searchQuery || undefined,
    page: currentPage,
    limit: EVENTS_PER_PAGE,
    sortOrder: getSortOrder(sortOption)
  };

  const { data: events, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, queryFilters],
    queryFn: () => EventService.getMany(queryFilters)
  });
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortOption]);

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

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto md:p-8 p-4 grid gap-6">
      <div className="grid items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Discover Events</h1>
        <p className="text-muted-foreground">Find and join exciting events happening around you</p>
      </div>
      {/* Featured Event */}
      {events?.items.length && (
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Featured Event</h1>
          <p className="text-muted-foreground">Find and join exciting events happening around you</p>

          <EventCard event={events.items[0]} />
        </div>
      )}
      <div className="grid gap-2">
        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <EventsSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

          <div className="flex gap-2 justify-between items-center flex-wrap">
            <EventsSort sortOption={sortOption} onSortChange={handleSortChange} />

            <EventViewToggle view={viewMode} setView={setViewMode} />

            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFilters}
              className={cn(showFilters && 'bg-primary-light')}>
              <FiSliders className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
        />

        <div
          className={cn(
            'p-4 bg-accent rounded-lg animate-in fade-in-0 zoom-in-95 duration-200',
            showFilters ? 'block' : 'hidden'
          )}>
          {/* Filters */}
          <EventFilters onFilterChange={setFilters} />
        </div>
      </div>
      {/* Events Display */}
      <EventsDisplay
        events={events?.items || []}
        isLoading={isLoading}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={events?.meta.totalPages || 1}
        pageSize={events?.meta.itemsPerPage || EVENTS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// Helper function to convert sort option to sort order
function getSortOrder(sortOption: SortOption): 'asc' | 'desc' | undefined {
  switch (sortOption) {
    case 'date':
      return 'asc'; // Soonest first
    case 'price-low':
      return 'asc';
    case 'price-high':
      return 'desc';
    case 'name':
      return 'asc';
    default:
      return undefined;
  }
}
