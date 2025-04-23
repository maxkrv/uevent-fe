import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates
} from 'nuqs';
import { useState } from 'react';
import { FiSliders } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { cn, getPagesAmount } from '@/shared/lib/utils';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { ActiveFilters } from '../components/active-filters';
import { EventCard } from '../components/event.card';
import { EventFilters } from '../components/event-filters';
import { EventsView, EventViewToggle } from '../components/event-view-toggle';
import { EventsDisplay } from '../components/events-display';
import { EventsSearch } from '../components/events-search';
import { EventsSort } from '../components/events-sort';
import { EventFormatType, EventThemeType } from '../interfaces/event.interface';
import { EventGetManyDto, EventService, EventSortOption } from '../services/event.service';

const EVENTS_PER_PAGE = 10;

export const EventsPage = () => {
  const [viewMode, setViewMode] = useState<EventsView>(EventsView.GRID);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useQueryStates({
    format: parseAsArrayOf(parseAsStringLiteral(Object.values(EventFormatType))).withDefault([]),
    search: parseAsString.withDefault(''),
    themes: parseAsArrayOf(parseAsStringLiteral(Object.values(EventThemeType))).withDefault([]),
    fromDate: parseAsIsoDate,
    toDate: parseAsIsoDate,
    priceTo: parseAsInteger,
    priceFrom: parseAsInteger,
    sort: parseAsStringLiteral(['date', 'price-low', 'price-high', 'name'] as const).withDefault('date'),
    page: parseAsInteger.withDefault(1)
  });

  // Combine search query with filters
  const queryFilters: EventGetManyDto = {
    ...filters,
    priceTo: (filters?.priceTo || 0) >= 300 ? undefined : filters.priceTo!,
    limit: EVENTS_PER_PAGE
  };

  const { data: events, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, queryFilters],
    queryFn: () => EventService.getMany(queryFilters)
  });

  const handleFilterChange = (filter: EventGetManyDto) => {
    console.log('🚀 ~ handleFilterChange ~ filter:', filter);
    setFilters({
      ...filter,
      page: 1
    });
  };

  const handleSearchChange = (query: string) => {
    setFilters((value) => ({ ...value, search: query, page: 1 }));
  };

  const handleSortChange = (option: EventSortOption) => {
    setFilters((value) => ({ ...value, sort: option, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((value) => ({ ...value, page }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setFilters((value) => ({ ...value, search: '', page: 1 }));
  };
  const handleClearFilters = () => {
    console.log(123123);
    setFilters((value) => {
      // convert all to null
      const obj = Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          if (key === 'page' || key === 'sort' || key === 'search') {
            return [key, value];
          }

          return [key, null];
        })
      );

      return obj;
    });
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
          <EventsSearch searchQuery={filters.search} onSearchChange={handleSearchChange} />

          <div className="flex gap-2 justify-between items-center flex-wrap">
            <EventsSort sortOption={filters.sort} onSortChange={handleSortChange} />

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
          searchQuery={filters.search}
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
          <EventFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleClearFilters} />
        </div>
      </div>
      {/* Events Display */}
      <EventsDisplay
        events={events?.items || []}
        isLoading={isLoading}
        viewMode={viewMode}
        currentPage={filters.page || 1}
        totalPages={getPagesAmount(events?.meta.totalItemsCount || 0, EVENTS_PER_PAGE) || 1}
        pageSize={events?.meta.itemsPerPage || EVENTS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
