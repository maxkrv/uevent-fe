'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export type SortOption = 'date' | 'price-low' | 'price-high' | 'name';

interface EventsSortProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const EventsSort = ({ sortOption, onSortChange }: EventsSortProps) => {
  return (
    <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
      <SelectTrigger className="min-w-45 grow">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Date (Soonest)</SelectItem>
        <SelectItem value="price-low">Price (Low to High)</SelectItem>
        <SelectItem value="price-high">Price (High to Low)</SelectItem>
        <SelectItem value="name">Name (A-Z)</SelectItem>
      </SelectContent>
    </Select>
  );
};
