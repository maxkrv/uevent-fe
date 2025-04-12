'use client';

import { useEffect, useRef, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { Event } from '../../event/interfaces/event.interface';

interface EventsMapProps {
  events: Event[];
}

export const EventsMap = ({ events }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Leaflet, Google Maps, or Mapbox
    const renderMap = () => {
      if (!mapRef.current) return;

      const mapContainer = mapRef.current;

      // Clear previous content
      mapContainer.innerHTML = '';

      // Create a simple placeholder map
      const mapElement = document.createElement('div');
      mapElement.className = 'w-full h-full bg-accent relative';

      // Add a grid to simulate a map
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const gridCell = document.createElement('div');
          gridCell.className = 'absolute border border-border/20';
          gridCell.style.width = '10%';
          gridCell.style.height = '10%';
          gridCell.style.left = `${j * 10}%`;
          gridCell.style.top = `${i * 10}%`;
          mapElement.appendChild(gridCell);
        }
      }

      // Add event markers
      events.forEach((event, index) => {
        if (!event.location?.latitude || !event.location?.longitude) return;

        // Normalize coordinates to fit our simple map
        // In a real map, you would use actual coordinates
        const x = ((event.location.longitude + 180) / 360) * 100;
        const y = ((90 - event.location.latitude) / 180) * 100;

        const marker = document.createElement('div');
        marker.className =
          'absolute w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform';
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.textContent = `${index + 1}`;

        marker.addEventListener('click', () => {
          setSelectedEvent(event);
        });

        mapElement.appendChild(marker);
      });

      mapContainer.appendChild(mapElement);
    };

    renderMap();
  }, [events]);

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full bg-accent"></div>

      {/* Map overlay with instructions */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-semibold mb-2">Map View</h3>
        <p className="text-sm text-muted-foreground">
          This is a placeholder for an interactive map. In a real application, you would see event locations plotted on
          a map.
        </p>
        <p className="text-sm text-muted-foreground mt-2">Click on a numbered marker to view event details.</p>
      </div>

      {/* Selected event card */}
      {selectedEvent && (
        <Card className="absolute bottom-4 right-4 w-80 shadow-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-2">{selectedEvent.location?.address}</p>
            <p className="text-sm mb-4 line-clamp-2">{selectedEvent.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium">{selectedEvent.price ? `$${selectedEvent.price.toFixed(2)}` : 'Free'}</span>
              <Button size="sm" className="gap-1">
                <span>View</span>
                <FiExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
