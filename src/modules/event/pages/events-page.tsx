import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates
} from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
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
    sort: parseAsStringLiteral(['date-asc', 'date-desc', 'price-low', 'price-high', 'name'] as const).withDefault(
      'date-asc'
    ),
    page: parseAsInteger.withDefault(1),
    lat: parseAsFloat,
    lng: parseAsFloat,
    companyId: parseAsString,
    address: parseAsString
  });

  const queryFilters: EventGetManyDto = useMemo(
    () => ({
      ...filters,
      companyId: filters.companyId || undefined,
      priceTo: (filters?.priceTo || 0) >= 300 ? null : filters.priceTo!,
      page: viewMode !== EventsView.MAP ? filters.page : null,
      limit: viewMode !== EventsView.MAP ? EVENTS_PER_PAGE : null
    }),
    [filters, viewMode]
  );

  const { data: events, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, queryFilters],
    queryFn: () => EventService.getMany(queryFilters)
  });

  const handleFilterChange = useCallback(
    (filter: EventGetManyDto) => {
      setFilters({
        ...filter,
        page: 1
      });
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setFilters((value) => ({ ...value, search: query, page: 1 }));
    },
    [setFilters]
  );

  const handleSortChange = useCallback(
    (option: EventSortOption) => {
      setFilters((value) => ({ ...value, sort: option, page: 1 }));
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((value) => ({ ...value, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setFilters]
  );

  const handleClearSearch = useCallback(() => {
    setFilters((value) => ({ ...value, search: '', page: 1 }));
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters((value) => {
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
  }, [setFilters]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <div className="container mx-auto md:p-8 p-4 grid gap-6">
      <div className="grid items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Discover Events</h1>
        <p className="text-muted-foreground">Find and join exciting events happening around you</p>
      </div>

      {!!events?.items.length && (
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Featured Event</h1>
          <p className="text-muted-foreground">Find and join exciting events happening around you</p>
          <EventCard event={events.items[0]} />
        </div>
      )}

      <div className="grid gap-2">
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
          <EventFilters filters={queryFilters} onFilterChange={handleFilterChange} onReset={handleClearFilters} />
        </div>
      </div>

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
