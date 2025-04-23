import { FiSearch, FiX } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface CompanySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'name' | 'events' | 'newest';
  setSortBy: (sort: 'name' | 'events' | 'newest') => void;
}

export const CompanySearch = ({ searchQuery, setSearchQuery, sortBy, setSortBy }: CompanySearchProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies by name, description, or location..."
            className="pl-10 pr-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery('')}>
              <FiX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            className="bg-background border border-input rounded-md px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'events' | 'newest')}>
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="events">Most Events</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-accent rounded-full px-3 py-1 text-sm flex items-center">
            <span className="mr-2">Search: {searchQuery}</span>
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setSearchQuery('')}>
              <FiX className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
