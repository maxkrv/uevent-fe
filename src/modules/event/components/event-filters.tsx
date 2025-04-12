'use client';

import { useEffect, useState } from 'react';
import { FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';

import { type Event, EventFormat } from '../../event/interfaces/event.interface';
import { DateRangeFilter } from './date-range-filter';

interface EventFiltersProps {
  events: Event[];
  onFilterChange: (filteredEvents: Event[]) => void;
}

export const EventFilters = ({ events, onFilterChange }: EventFiltersProps) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [formatFilter, setFormatFilter] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  // Extract unique categories from events
  useEffect(() => {
    const uniqueCategories = events.reduce(
      (acc, event) => {
        if (event.category && !acc.some((cat) => cat.id === event.category?.id)) {
          acc.push({ id: event.category.id, name: event.category.name });
        }
        return acc;
      },
      [] as { id: string; name: string }[]
    );
    setCategories(uniqueCategories);
  }, [events]);

  // Apply filters
  useEffect(() => {
    // Skip initial render when events array might be empty
    if (events.length === 0) return;

    let filtered = [...events];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) => event.category && selectedCategories.includes(event.category.id));
    }

    // Filter by price range
    filtered = filtered.filter((event) => (event.price || 0) >= priceRange[0] && (event.price || 0) <= priceRange[1]);

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= fromDate;
      });
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate <= toDate;
      });
    }

    // Filter by format
    if (formatFilter.length > 0) {
      filtered = filtered.filter((event) => event.format && formatFilter.includes(event.format));
    }

    // Filter by location
    if (location.trim() !== '') {
      filtered = filtered.filter((event) => event.location?.address.toLowerCase().includes(location.toLowerCase()));
    }

    onFilterChange(filtered);
  }, [selectedCategories, priceRange, dateRange, formatFilter, location, events]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleFormatChange = (format: string) => {
    setFormatFilter((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]));
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange([0, 300]);
    setDateRange({ from: undefined, to: undefined });
    setFormatFilter([]);
    setLocation('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Left Column: Categories and Format */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-3">
            <FiTag className="mr-2 text-primary" />
            <h3 className="font-semibold">Categories</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="ml-2 text-sm font-normal cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Event Format</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(EventFormat).map((format) => (
              <div key={format} className="flex items-center">
                <Checkbox
                  id={`format-${format}`}
                  checked={formatFilter.includes(format)}
                  onCheckedChange={() => handleFormatChange(format)}
                />
                <Label htmlFor={`format-${format}`} className="ml-2 text-sm font-normal cursor-pointer capitalize">
                  {format.toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Column: Date Range */}
      <div className="space-y-6 border-x-2 p-3 ">
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      {/* Right Column: Price and Location */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-3">
            <FiDollarSign className="mr-2 text-primary" />
            <h3 className="font-semibold">Price</h3>
          </div>
          <div className="px-2">
            <Slider
              value={priceRange}
              min={0}
              max={300}
              step={5}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mb-6"
            />
            <div className="flex justify-between">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}+</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Checkbox
              id="free-events"
              checked={priceRange[0] === 0 && priceRange[1] === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPriceRange([0, 0]);
                } else {
                  setPriceRange([0, 300]);
                }
              }}
            />
            <Label htmlFor="free-events" className="ml-2 text-sm font-normal cursor-pointer">
              Free events only
            </Label>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <FiMapPin className="mr-2 text-primary" />
            <h3 className="font-semibold">Location</h3>
          </div>
          <Input
            placeholder="City or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mb-2"
          />
        </div>

        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
