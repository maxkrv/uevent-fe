'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EventsMap as EventsMapComponent, type MapEvent } from '../../../shared/components/maps/events-map';
import type { Event } from '../interfaces/event.interface';

interface EventsMapComponentProps {
  events: Event[];
  highlightedEventId?: string | null;
}

export const EventsMap = ({ events, highlightedEventId }: EventsMapComponentProps) => {
  const [mapEvents, setMapEvents] = useState<MapEvent[]>([]);
  const navigate = useNavigate();

  // Convert events to map events format
  useEffect(() => {
    const convertedEvents = events
      .filter((event) => event.location?.lat && event.location?.lng) // Only include events with valid coordinates
      .map((event) => ({
        id: event.id,
        title: event.title,
        description:
          event.description?.substring(0, 100) + (event.description && event.description.length > 100 ? '...' : ''),
        position: {
          lat: event.location?.lat || 0,
          lng: event.location?.lng || 0
        },
        startDate: event.startDate,
        imageUrl: event.posterUrl,
        price: event.price,
        url: `/events/${event.id}`
      }));

    setMapEvents(convertedEvents);
  }, [events]);

  const handleMarkerClick = (event: MapEvent) => {
    navigate(`/events/${event.id}`);
  };

  // Handle highlighted event
  useEffect(() => {
    if (highlightedEventId) {
      const highlightedEvent = mapEvents.find((event) => event.id === highlightedEventId);
      if (highlightedEvent) {
        // Simulate a click on the highlighted event
        handleMarkerClick(highlightedEvent);
      }
    }
  }, [highlightedEventId, mapEvents]);

  return (
    <div className="h-150 rounded-lg overflow-hidden">
      <EventsMapComponent events={mapEvents} onMarkerClick={handleMarkerClick} />
    </div>
  );
};
