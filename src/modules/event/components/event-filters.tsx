'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';
import { useDebounceValue } from 'usehooks-ts';
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Slider } from '@/shared/components/ui/slider';

import LocationSearch from '../../../shared/components/maps/location-search';
import { EventFormatType, EventThemeType } from '../interfaces/event.interface';
import type { EventGetManyDto } from '../services/event.service';
import { DateRangeFilter } from './date-range-filter';

// Define the Zod schema for the filter form
const FilterFormSchema = z.object({
  themes: z.array(z.nativeEnum(EventThemeType)).optional(),
  format: z.array(z.nativeEnum(EventFormatType)).optional(),
  location: z
    .object({
      address: z.string(),
      lat: z.number(),
      lng: z.number()
    })
    .optional(),
  priceRange: z.tuple([z.number(), z.number()]),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional()
  }),
  freeEventsOnly: z.boolean().default(false)
});

type FilterFormValues = z.infer<typeof FilterFormSchema>;

interface EventFiltersProps {
  onFilterChange: (filter: EventGetManyDto) => void;
}

const MAX_PRICE = 300;

export const EventFilters = ({ onFilterChange }: EventFiltersProps) => {
  // Initialize the form with React Hook Form and Zod validation
  const { control, watch, setValue, reset, getValues } = useForm<FilterFormValues>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      themes: [],
      format: [],
      location: undefined,
      priceRange: [0, MAX_PRICE],
      dateRange: {
        from: undefined,
        to: undefined
      },
      freeEventsOnly: false
    }
  });

  // Watch for form value changes
  const formValues = watch();
  const freeEventsOnly = watch('freeEventsOnly');

  // Debounce form values to prevent excessive updates
  const [debouncedFormValues, updateDebouncedFormValues] = useDebounceValue<FilterFormValues>(getValues(), 500);

  useEffect(() => {
    updateDebouncedFormValues(formValues);
  }, [formValues, updateDebouncedFormValues]);
  // Update price range when "free events only" is toggled
  useEffect(() => {
    if (freeEventsOnly) {
      setValue('priceRange', [0, 0]);
    } else if (formValues.priceRange[0] === 0 && formValues.priceRange[1] === 0) {
      setValue('priceRange', [0, MAX_PRICE]);
    }
  }, [freeEventsOnly, formValues.priceRange, setValue]);

  // Apply filters when debounced form values change
  useEffect(() => {
    const filters: EventGetManyDto = {};
    if (!debouncedFormValues) return;
    // Only add non-empty values to filters
    if (debouncedFormValues.themes && debouncedFormValues.themes.length > 0) {
      filters.themes = debouncedFormValues.themes;
    }

    if (debouncedFormValues.format && debouncedFormValues.format.length > 0) {
      filters.format = debouncedFormValues.format;
    }

    // Only add location if address is provided
    if (debouncedFormValues.location?.address && debouncedFormValues.location.address.trim() !== '') {
      filters.location = debouncedFormValues.location;
    }

    // Add date range if either from or to is defined
    if (debouncedFormValues.dateRange.from) {
      filters.startDate = debouncedFormValues.dateRange.from;
    }

    if (debouncedFormValues.dateRange.to) {
      filters.endDate = debouncedFormValues.dateRange.to;
    }

    // Add price range
    filters.priceFrom = debouncedFormValues.priceRange[0];

    // Only add priceTo if it's not the max value
    if (debouncedFormValues.priceRange[1] < MAX_PRICE) {
      filters.priceTo = debouncedFormValues.priceRange[1];
    }

    onFilterChange(filters);
  }, [debouncedFormValues, onFilterChange]);

  const handleReset = () => {
    reset({
      themes: [],
      format: [],
      location: {
        address: '',
        lat: 1,
        lng: 1
      },
      priceRange: [0, MAX_PRICE],
      dateRange: {
        from: undefined,
        to: undefined
      },
      freeEventsOnly: false
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Categories, Format, and Date Range */}
      <div className="space-y-6">
        {/* Categories Section */}
        <div>
          <div className="flex items-center mb-3">
            <FiTag className="mr-2 text-primary" />
            <h3 className="font-semibold">Categories</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(EventThemeType).map((category) => (
              <div key={category} className="flex items-center">
                <Controller
                  name="themes"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`category-${category}`}
                      checked={field.value?.includes(category) || false}
                      onCheckedChange={(checked) => {
                        const currentThemes = field.value || [];
                        if (checked) {
                          setValue('themes', [...currentThemes, category]);
                        } else {
                          const filtered = currentThemes.filter((theme) => theme !== category);
                          setValue('themes', filtered.length > 0 ? filtered : []);
                        }
                      }}
                    />
                  )}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm font-normal cursor-pointer capitalize truncate">
                  {category.replace(/_/g, ' ').toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Event Format Section */}
        <div>
          <h3 className="font-semibold mb-3">Event Format</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(EventFormatType).map((format) => (
              <div key={format} className="flex items-center">
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`format-${format}`}
                      checked={field.value?.includes(format) || false}
                      onCheckedChange={(checked) => {
                        const currentFormats = field.value || [];
                        if (checked) {
                          setValue('format', [...currentFormats, format]);
                        } else {
                          const filtered = currentFormats.filter((f) => f !== format);
                          setValue('format', filtered.length > 0 ? filtered : []);
                        }
                      }}
                    />
                  )}
                />
                <Label
                  htmlFor={`format-${format}`}
                  className="ml-2 text-sm font-normal cursor-pointer capitalize truncate">
                  {format.replace(/_/g, ' ').toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-2 md:hidden" />
      </div>
      {/* Right Column: Price and Location */}
      <div className="space-y-4 md:pl-6 md:border-l-2">
        {/* Date Range Section */}
        <Controller
          name="dateRange"
          control={control}
          render={({ field }) => (
            <DateRangeFilter dateRange={field.value} onDateRangeChange={(range) => field.onChange(range)} />
          )}
        />

        <Separator />

        <div>
          <div className="flex items-center mb-3">
            <FiDollarSign className="mr-2 text-primary" />
            <h3 className="font-semibold">Price</h3>
          </div>
          <div className="px-2 grid gap-2">
            <Controller
              name="priceRange"
              control={control}
              render={({ field }) => (
                <Slider
                  value={field.value}
                  min={0}
                  max={300}
                  step={5}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={freeEventsOnly}
                />
              )}
            />
            <div className="flex justify-between">
              <span className="text-sm">${formValues.priceRange[0]}</span>
              <span className="text-sm">
                ${formValues.priceRange[1] === MAX_PRICE ? `${MAX_PRICE}+` : formValues.priceRange[1]}
              </span>
            </div>
            <div className="flex items-center">
              <Controller
                name="freeEventsOnly"
                control={control}
                render={({ field }) => (
                  <Checkbox id="free-events" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="free-events" className="ml-2 text-sm font-normal cursor-pointer">
                Free events only
              </Label>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex items-center mb-3">
            <FiMapPin className="mr-2 text-primary" />
            <h3 className="font-semibold">Location</h3>
          </div>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationSearch placeholder="Search for a location" onPlaceSelect={field.onChange} />
            )}
          />
        </div>

        <Separator className="my-4" />

        <Button variant="outline" onClick={handleReset} className="w-full mt-auto">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
