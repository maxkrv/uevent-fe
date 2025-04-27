import { useQuery } from '@tanstack/react-query';
import { Calendar, Check, Clock, MapPin, Ticket } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Pagination } from '@/shared/components/common/pagination';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';
import dayjs from '@/shared/lib/dayjs';

import { Image } from '../../../../shared/components/common/image';
import { UserService } from '../../services/user.service';
import { UserNoItems } from './user-no-items';

interface UserTicketsProps {
  userId: string;
}

export const UserTickets = ({ userId }: UserTicketsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tickets, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_TICKETS, userId],
    queryFn: UserService.getTickets,
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 })
          .fill(0)
          .map((_data, i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-24 w-full md:w-24 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!isLoading && !tickets?.items.length) {
    return (
      <UserNoItems
        icon={Ticket}
        title="No Tickets Purchased"
        description="This user hasn't purchased any tickets yet."
      />
    );
  }

  // Sort tickets by purchase date (newest first)

  // Status badge colors
  const statusColors = {
    VALID: 'bg-green-500/10 text-green-600 border-green-500/20',
    USED: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    CANCELLED: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tickets?.items.map((ticket) => (
          <div key={ticket.id} className="bg-card rounded-lg border p-4 hover:border-primary transition-colors">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="h-24 w-full md:w-24 rounded-md overflow-hidden flex-shrink-0">
                <Image src={ticket.event.posterUrl} alt={ticket.event.title} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <Link to={`/events/${ticket.event.id}`} className="font-medium hover:text-primary transition-colors">
                    {ticket.event.title}
                  </Link>
                  <Badge variant="outline" className={statusColors[ticket.status]}>
                    {ticket.status === 'VALID' && <Check className="h-3 w-3 mr-1" />}
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {dayjs(ticket.event.startDate).format('MMM D, YYYY')}
                  </div>

                  {ticket.event.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      <span className="truncate">{ticket.event.location.address}</span>
                    </div>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <Ticket className="mr-1 h-3.5 w-3.5" />
                    Ticket #{ticket.id.substring(0, 8)}
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Purchased {dayjs(ticket.purchaseDate).format('MMM D, YYYY')}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="font-medium">
                    {ticket.event.price > 0 ? `$${ticket.event.price.toFixed(2)}` : 'Free'}
                  </div>
                  <Link to={`/events/${ticket.event.id}`} className="text-sm text-primary hover:underline">
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(tickets?.meta?.totalPages || 0) > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={tickets?.meta?.totalPages || 0}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
