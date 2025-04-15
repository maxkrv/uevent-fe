import { Calendar, MapPin } from 'lucide-react';
import { FC } from 'react';

import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import dayjs from '../../../shared/lib/dayjs';
import { cn } from '../../../shared/lib/utils';
import { Event } from '../interfaces/event.interface';

interface ShortEventCardProps extends Partial<React.ComponentProps<typeof Link>> {
  event: Event;
}

export const ShortEventCard: FC<ShortEventCardProps> = ({ event, className, ...props }) => {
  return (
    <Link
      key={event.id}
      unstyled
      to={`/events/${event.id}`}
      {...props}
      className={cn(
        'bg-card rounded-lg border p-2 hover:border-primary transition-colors group flex hover:bg-muted',
        className
      )}>
      <div className="flex gap-4">
        <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={event.poster || `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(event.title)}`}
            alt={event.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>

          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="mr-1 h-3 w-3" />
            {dayjs(event.startDate).format('MMM D, YYYY')}
          </div>

          {event.location && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <MapPin className="mr-1 h-3 w-3" />
              <span className="truncate">{event.location.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
            </Badge>

            {event.category && (
              <Badge variant="secondary" className="text-xs">
                {event.category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
