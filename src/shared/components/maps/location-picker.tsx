'use client';

import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Location } from '../../../modules/event/interfaces/event.interface';
import { useGoogleMaps } from '../../hooks/maps/use-google-maps';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface LocationPickerProps {
  initialLocation?: Location;
  onLocationChange?: (location: Location) => void;
  height?: string | number;
  width?: string | number;
  zoom?: number;
  className?: string;
}

type MapLocation = {
  lat: number;
  lng: number;
};

export const LocationPicker = ({
  initialLocation,
  onLocationChange,
  height = '400px',
  width = '100%',
  zoom = 14,
  className
}: LocationPickerProps) => {
  // Default to a central location if none provided
  const [location, setLocation] = useState<MapLocation>(initialLocation || { lat: 37.7749, lng: -122.4194 });
  const [address, setAddress] = useState<string>(initialLocation?.address || '');
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const { isLoaded, isError, errorMessage } = useGoogleMaps();

  // Initialize geocoder when map is loaded
  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();

      // If we have an initial location, try to get its address
      if (initialLocation && !initialLocation.address) {
        geocodePosition(initialLocation);
      }
    }
  }, [isLoaded, initialLocation]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Geocode a position to get the address
  const geocodePosition = useCallback(
    (pos: MapLocation) => {
      if (!geocoderRef.current) return;

      geocoderRef.current.geocode({ location: pos }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);

          // Update location with address
          const updatedLocation = { ...pos, address: newAddress };
          setLocation(updatedLocation);
          onLocationChange?.(updatedLocation);
        }
      });
    },
    [onLocationChange]
  );

  // Handle marker drag end
  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };

        setLocation(newPos);
        geocodePosition(newPos);
      }
    },
    [geocodePosition]
  );

  // Handle map click
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };

        setLocation(newPos);
        geocodePosition(newPos);
      }
    },
    [geocodePosition]
  );

  // Center map on current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          setLocation(pos);
          geocodePosition(pos);

          if (mapRef.current) {
            mapRef.current.panTo(pos);
          }
        },
        () => {
          toast.error('The Geolocation service failed.');
        }
      );
    } else {
      toast.error("Your browser doesn't support geolocation.");
    }
  };

  if (isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Error loading Google Maps: {errorMessage}
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-[400px] rounded-md" />;
  }

  return (
    <div className={className}>
      <div className="relative">
        <GoogleMap
          mapContainerStyle={{ width, height }}
          center={location}
          zoom={zoom}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true
          }}>
          <Marker position={location} draggable={true} onDragEnd={onMarkerDragEnd} />
        </GoogleMap>

        <div className="absolute top-4 right-4 z-10">
          <Button variant="secondary" size="sm" onClick={handleUseCurrentLocation} className="shadow-md">
            Use My Location
          </Button>
        </div>
      </div>

      {address && (
        <div className="mt-2 p-2 bg-muted rounded-md text-sm">
          <strong>Selected Address:</strong> {address}
        </div>
      )}
    </div>
  );
};
