'use client';

import { ExternalLink, MapPin } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import type { Location } from '../../interfaces/event.interface';

interface EventMapProps {
  location: Location;
}

export const EventMap = ({ location }: EventMapProps) => {
  const openInMaps = () => {
    const url =
      'https://maps.google.com/?q=' +
      (location.latitude && location.longitude
        ? `${location.latitude},${location.longitude}`
        : `${encodeURIComponent(location.address)}`);

    window.open(url, '_blank');
  };

  return (
    <div className="relative h-80 rounded-lg overflow-hidden bg-muted group border">
      {/* Stylized map placeholder */}
      <div className="absolute inset-0 bg-[#f2f2f2] dark:bg-[#1a1a1a]">
        {/* Major roads */}
        <div className="absolute top-1/3 left-0 w-full h-[8px] bg-[#e0e0e0] dark:bg-[#333333]"></div>
        <div className="absolute top-2/3 left-0 w-full h-[6px] bg-[#e0e0e0] dark:bg-[#333333]"></div>
        <div className="absolute top-0 left-1/4 w-[8px] h-full bg-[#e0e0e0] dark:bg-[#333333]"></div>
        <div className="absolute top-0 left-3/4 w-[6px] h-full bg-[#e0e0e0] dark:bg-[#333333]"></div>

        {/* Minor roads */}
        <div className="absolute top-1/6 left-0 w-full h-[3px] bg-[#e8e8e8] dark:bg-[#2a2a2a]"></div>
        <div className="absolute top-5/6 left-0 w-full h-[3px] bg-[#e8e8e8] dark:bg-[#2a2a2a]"></div>
        <div className="absolute top-0 left-1/6 w-[3px] h-full bg-[#e8e8e8] dark:bg-[#2a2a2a]"></div>
        <div className="absolute top-0 left-5/6 w-[3px] h-full bg-[#e8e8e8] dark:bg-[#2a2a2a]"></div>

        {/* City blocks */}
        <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-[#ebebeb] dark:border-[#222222]"></div>
          ))}
        </div>

        {/* Parks and landmarks */}
        <div className="absolute top-1/4 left-1/5 w-[15%] h-[10%] rounded-full bg-[#c8e6c9] dark:bg-[#1b5e20]/40"></div>
        <div className="absolute bottom-1/4 right-1/5 w-[20%] h-[15%] rounded-md bg-[#bbdefb] dark:bg-[#0d47a1]/40"></div>
      </div>

      {/* Location pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative flex flex-col items-center">
          <div className="text-primary text-4xl animate-bounce-slow">
            <MapPin className="drop-shadow-md" />
          </div>
          <p className="text-muted-foreground">{location.address}</p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary/20 rounded-full -z-10 animate-ping"></div>
        </div>
      </div>

      {/* Overlay with controls */}
      <div
        className={`absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-500 z-20 group-hover:bg-black/30`}>
        <div className={`transform transition-all duration-500 opacity-0 group-hover:opacity-100`}>
          <Button onClick={openInMaps} className="shadow-lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
};
