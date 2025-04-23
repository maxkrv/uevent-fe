import { Check, Loader2 } from 'lucide-react';
import { type CSSProperties, type FC, useCallback, useEffect, useRef, useState } from 'react';

import { useAddressSuggestions } from '@/shared/hooks/maps/use-address-suggestions';
import { useGoogleMaps } from '@/shared/hooks/maps/use-google-maps';
import { usePlaceDetails } from '@/shared/hooks/maps/use-places-details';
import { useReverseGeocoding } from '@/shared/hooks/maps/use-reverse-geocoding';
import { cn } from '@/shared/lib/utils';
import type { LocationDto } from '@/shared/types/maps';

import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDebounce } from '../ui/multi-selector';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LocationPicker } from './location-picker';

interface AddressAutocompleteProps {
  onAddressSelect?: (address: LocationDto) => void;
  defaultValue?: LocationDto;
  placeholder?: string;
  className?: string;
  mapContainerStyle?: CSSProperties;
}

export const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  defaultValue,
  placeholder = 'Search for an address...',
  className,
  mapContainerStyle = {
    width: '100%',
    height: '280px'
  }
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue?.address || '');
  const [selectedAddress, setSelectedAddress] = useState<LocationDto | null>(null);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useGoogleMaps();
  const [debouncedValue, isTyping] = useDebounce(inputValue, 500);

  useEffect(() => {
    if (isLoaded) {
      autocompleteService.current = new google.maps.places.AutocompleteService();

      const dummyElement = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(dummyElement);

      if (defaultValue?.lat && defaultValue.lng) {
        reverseGeocode(defaultValue);
      }
    }
  }, [isLoaded]);

  const { mutate: getPlaceDetails, isPending: isFetchingDetails } = usePlaceDetails((newAddress) => {
    setSelectedAddress(newAddress);
    setInputValue(newAddress.address);
    onAddressSelect?.(newAddress);
  });

  const { mutate: reverseGeocode, isPending: isReverseGeocoding } = useReverseGeocoding((newAddress) => {
    setSelectedAddress(newAddress);
    setInputValue(newAddress.address);
    onAddressSelect?.(newAddress);
  });

  const { data: suggestions, isFetching } = useAddressSuggestions(
    debouncedValue,
    debouncedValue.length >= 3,
    autocompleteService.current
  );

  // Auto-select the suggestion when there's exactly one
  useEffect(() => {
    if (suggestions?.length === 1 && !isFetching && !isTyping && placesService.current) {
      // Auto-select the single suggestion
      getPlaceDetails({
        placeId: suggestions[0].placeId,
        placesService: placesService.current
      });
    }
  }, [suggestions, isFetching, isTyping, getPlaceDetails]);

  const handleSuggestionOpen = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!open) {
        handleSuggestionOpen();
      }

      setInputValue(e.target.value);
    },
    [open]
  );

  console.log('suggestions', suggestions);
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading Google Maps...</span>
      </div>
    );
  }

  const isLoading = isFetching || isReverseGeocoding || isFetchingDetails || isTyping;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Popover open={open}>
          <Command className="border-none bg-transparent">
            <PopoverTrigger>
              <Input
                type="search"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onClick={handleSuggestionOpen}
                ref={inputRef}
              />
            </PopoverTrigger>
            <PopoverContent
              className="min-w-100 p-0 border-none"
              side="bottom"
              sideOffset={4}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
              onInteractOutside={() => {
                setOpen(false);
              }}
              showArrow={false}>
              <CommandList className="w-full min-w-full">
                {!isLoading && (!inputValue || (suggestions?.length || 0) === 1) && (
                  <div className="rounded-md border overflow-hidden">
                    <LocationPicker
                      initialLocation={selectedAddress || undefined}
                      onLocationChange={(newAddress) => {
                        setSelectedAddress(newAddress);
                        setInputValue(newAddress.address);
                        onAddressSelect?.(newAddress);
                      }}
                      height={mapContainerStyle.height}
                      width={mapContainerStyle.width}
                    />
                  </div>
                )}
                {suggestions?.length === 0 && !isLoading && inputValue && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> No address found.</p>
                )}
                {isLoading && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> Searching for address...</p>
                )}
                {!isLoading && inputValue && (suggestions?.length || 0) > 1 && (
                  <CommandGroup>
                    {suggestions?.map((suggestion) => (
                      <CommandItem
                        key={suggestion.placeId}
                        value={suggestion.description}
                        onSelect={() => {
                          getPlaceDetails({
                            placeId: suggestion.placeId,
                            placesService: placesService.current
                          });
                          // setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedAddress?.address === suggestion.description ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {suggestion.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </PopoverContent>
          </Command>
        </Popover>
      </div>
    </div>
  );
};
