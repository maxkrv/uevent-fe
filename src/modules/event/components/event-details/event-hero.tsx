import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiCalendar, FiDollarSign, FiHeart, FiMapPin, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../../../shared/components/ui/badge';
import { Button } from '../../../../shared/components/ui/button';
import { useShare } from '../../../../shared/hooks/use-share';
import { Event } from '../../interfaces/event.interface';

interface EventHeroProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  '1': 'from-blue-900/70 to-blue-700/30', // Business
  '2': 'from-purple-900/70 to-purple-700/30', // Music
  '3': 'from-green-900/70 to-green-700/30', // Arts
  '4': 'from-orange-900/70 to-orange-700/30', // Food & Drink
  '5': 'from-red-900/70 to-red-700/30', // Sports
  default: 'from-gray-900/70 to-gray-700/30'
};
interface EventStatusBadgeProps {
  event: Event;
}
const EventStatusBadge = ({ event }: EventStatusBadgeProps) => {
  if (!event) return null;

  const now = dayjs();
  const startDate = dayjs(event.startDate);
  const endDate = event.endDate ? dayjs(event.endDate) : startDate.add(2, 'hour');

  if (now.isBefore(startDate)) {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        Upcoming
      </Badge>
    );
  }
  if (now.isAfter(endDate)) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Past Event
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
      Happening Now
    </Badge>
  );
};

export const EventHero = ({ event }: EventHeroProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const nav = useNavigate();
  const share = useShare();

  const handleShare = () => {
    if (!event) return;
    share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href
    });
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('dddd, MMMM D, YYYY');
  };

  // Get a color based on category for the gradient overlay
  const getCategoryColor = () => {
    return event.category?.id ? categoryColors[event.category.id] || categoryColors.default : categoryColors.default;
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor()} z-10`}></div>
      <img
        src={event.poster || '/placeholder.svg?height=600&width=1200'}
        alt={event.title}
        className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
      />

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {event.category && (
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                {event.category.name}
              </Badge>
            )}
            <EventStatusBadge event={event} />
            {event.format && (
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {event.format.toLowerCase()}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md line-clamp-2">{event.title}</h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
            <div className="flex items-center  mr-6 space-x-2">
              <FiCalendar className="mr-2" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate && event.endDate !== event.startDate && (
                <>
                  <FaArrowRightLong />
                  <span>{formatDate(event.endDate)}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-2 h-5 w-5" />
              <span>{event.location?.address || 'Online'}</span>
            </div>
            <div className="flex items-center">
              <FiDollarSign className="mr-2 h-5 w-5" />
              <span className="font-medium">{event.price ? `$${event.price.toFixed(2)}` : 'Free'}</span>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="link"
        size="icon"
        className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
        onClick={() => nav(-1)}
        aria-label="Go back">
        <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
        Go Back
      </Button>
      <div className="flex space-x-2 absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size={'icon'}
          className="text-white/90 hover:text-red-700/80 hover:bg-red-500/30  transition-colors duration-300 hover:border-red-700/80"
          onClick={() => setIsSaved(!isSaved)}
          aria-pressed={isSaved}
          aria-label="Like event">
          <FiHeart className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size={'icon'}
          onClick={handleShare}
          className=" text-white/90 hover:text-primary hover:bg-primary/30 transition-colors duration-300"
          aria-label="Share event">
          <FiShare2 className="size-6" />
        </Button>
      </div>
    </div>
  );
};
