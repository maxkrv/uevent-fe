'use client';

import { FiSearch, FiX } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface EventsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const EventsSearch = ({ searchQuery, onSearchChange, className }: EventsSearchProps) => {
  return (
    <div className={`relative flex-grow ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search events, categories, or locations..."
        className="pl-10 pr-10 w-full"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={() => onSearchChange('')}>
          <FiX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
