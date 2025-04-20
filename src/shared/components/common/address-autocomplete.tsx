import { GoogleMap, Marker } from '@react-google-maps/api';
import { Check, Loader2 } from 'lucide-react';
import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useAddressSuggestions } from '@/shared/hooks/maps/use-address-suggestions';
import { useGoogleMaps } from '@/shared/hooks/maps/use-google-maps';
import { usePlaceDetails } from '@/shared/hooks/maps/use-places-details';
import { useReverseGeocoding } from '@/shared/hooks/maps/use-reverse-geocoding';
import { cn } from '@/shared/lib/utils';
import { LocationDto } from '@/shared/types/maps';

import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDebounce } from '../ui/multi-selector';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface AddressAutocompleteProps {
  onAddressSelect?: (address: LocationDto) => void;
  defaultValue?: LocationDto;
  placeholder?: string;
  className?: string;
  mapContainerStyle?: CSSProperties;
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006 // New York City as default
};

export const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  defaultValue,
  placeholder = 'Search for an address...',
  className,
  mapContainerStyle = {
    width: '100%',
    height: '300px'
  }
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue?.address || '');
  const [selectedAddress, setSelectedAddress] = useState<LocationDto | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | undefined>(undefined);
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
    setMapCenter({ lat: newAddress.lat, lng: newAddress.lng });
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

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      reverseGeocode({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    },
    [reverseGeocode]
  );

  const handleSuggestionOpen = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const handleInputChange = useCallback((value: string) => {
    if (!open) {
      handleSuggestionOpen();
    }

    setInputValue(value);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

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
              <CommandInput
                placeholder={placeholder}
                value={inputValue}
                onValueChange={handleInputChange}
                onClick={handleSuggestionOpen}
                ref={inputRef}
                asChild>
                <Input />
              </CommandInput>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] p-0 border-none"
              align="center"
              side="bottom"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
              onInteractOutside={() => {
                setOpen(false);
              }}
              showArrow={false}>
              <CommandList>
                {!suggestions?.length && !isLoading && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> No address found.</p>
                )}
                {isLoading && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> Searching for address...</p>
                )}
                {!isLoading && (
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
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
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

      <div className="rounded-md border overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={14}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            cameraControl: false,
            keyboardShortcuts: false,
            clickableIcons: false
          }}>
          {selectedAddress && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Marker position={{ lat: selectedAddress.lat, lng: selectedAddress.lng }} ref={markerRef as any} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
