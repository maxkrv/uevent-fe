'use client';

import { Autocomplete } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { useGoogleMaps } from '../../hooks/use-google-maps';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Define the type for the selected place
interface SelectedPlace {
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  placeId: string;
}

interface LocationSearchProps {
  onPlaceSelect?: (place: SelectedPlace | null) => void;
  placeholder?: string;
}

export default function LocationSearch({
  onPlaceSelect,
  placeholder = 'Search for a location...'
}: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useGoogleMaps();
  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const selectedPlace: SelectedPlace = {
          address: place.formatted_address || '',
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          placeId: place.place_id || ''
        };

        onPlaceSelect?.(selectedPlace);
        setSearchValue(place.formatted_address || '');
      } else {
        onPlaceSelect?.(null);
      }
    }
  }, [onPlaceSelect]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    onPlaceSelect?.(null);
  }, [onPlaceSelect]);

  return (
    <div className="relative">
      {isLoaded ? (
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: [] },
            fields: ['address_components', 'geometry', 'formatted_address', 'place_id'],
            strictBounds: false,
            types: ['geocode', 'establishment']
          }}>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={placeholder}
                className="pl-9"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            {searchValue && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </Autocomplete>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Loading Google Maps..." className="pl-9" disabled />
          </div>
        </div>
      )}
    </div>
  );
}
