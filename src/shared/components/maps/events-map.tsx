'use client';

import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useGoogleMaps } from '../../hooks/maps/use-google-maps';
import { Link } from '../common/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

// Define the event type for the map
export interface MapEvent {
  id: string;
  title: string;
  description?: string;
  position: {
    lat: number;
    lng: number;
  };
  startDate?: Date | string;
  imageUrl?: string;
  price?: number;
  url?: string;
}

interface EventsMapProps {
  events: MapEvent[];
  height?: string | number;
  width?: string | number;
  initialCenter?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMarkerClick?: (event: MapEvent) => void;
}

export const EventsMap = ({
  events,
  height = '600px',
  width = '100%',
  initialCenter,
  zoom = 12,
  className,
  onMarkerClick
}: EventsMapProps) => {
  const { isLoaded, isError, errorMessage } = useGoogleMaps();
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState(initialCenter);

  // Calculate center if not provided
  useEffect(() => {
    if (!initialCenter && events.length > 0 && isLoaded) {
      // Calculate the center based on all event positions
      const bounds = new window.google.maps.LatLngBounds();
      events.forEach((event) => {
        bounds.extend(event.position);
      });

      // Get the center of the bounds
      const newCenter = {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2
      };

      setCenter(newCenter);
    }
  }, [events, initialCenter, isLoaded]);

  // Handle map load
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // If we have events, fit the map to show all markers
      if (events.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        events.forEach((event) => {
          bounds.extend(new window.google.maps.LatLng(event.position.lat, event.position.lng));
        });
        map.fitBounds(bounds);

        // Adjust zoom level to prevent showing multiple world copies
        // and to ensure proper view of markers
        window.google.maps.event.addListenerOnce(map, 'idle', () => {
          const currentZoom = map.getZoom() || 0;

          // Don't zoom in too far
          if (currentZoom > 15) {
            map.setZoom(15);
          }

          // Don't zoom out too far
          if (currentZoom < 2) {
            map.setZoom(2);
          }

          // Restrict to one world view
          map.setOptions({
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180
              },
              strictBounds: true
            }
          });
        });
      }
    },
    [events]
  );

  // Handle marker click
  const handleMarkerClick = (event: MapEvent) => {
    setSelectedEvent(event);
    onMarkerClick?.(event);
  };

  // Close info window
  const handleInfoWindowClose = () => {
    setSelectedEvent(null);
  };

  if (isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Error loading Google Maps: {errorMessage}
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full aspect-video rounded-md" />;
  }

  return (
    <div className={`${className} w-full h-full aspect-video relative`}>
      <GoogleMap
        mapContainerStyle={{
          width: width,
          height: height,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          // Restrict to one world view
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              west: -180,
              east: 180
            },
            strictBounds: true
          }
        }}>
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.position}
            onClick={() => handleMarkerClick(event)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        ))}

        {selectedEvent && (
          <InfoWindow position={selectedEvent.position} onCloseClick={handleInfoWindowClose}>
            <Card className="w-64 shadow-none border-0">
              <CardContent className="p-2 space-y-2">
                {selectedEvent.imageUrl && (
                  <div className="h-32 w-full overflow-hidden rounded-md">
                    <img
                      src={selectedEvent.imageUrl || '/placeholder.svg'}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-base">{selectedEvent.title}</CardTitle>

                {selectedEvent.startDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{dayjs(selectedEvent.startDate).format('MMM D, YYYY')}</span>
                  </div>
                )}

                {selectedEvent.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{selectedEvent.description}</p>
                )}

                {selectedEvent.url && (
                  <Link to={selectedEvent.url} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
