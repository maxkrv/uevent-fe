import { useQuery } from '@tanstack/react-query';
import { Calendar, Check, Clock, ExternalLink, MapPin, Ticket } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';

import { Pagination } from '@/shared/components/common/pagination';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';
import dayjs from '@/shared/lib/dayjs';

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
          <Card key={ticket.id} className="overflow-hidden hover:border-primary transition-colors py-0">
            <div className="flex h-full">
              {/* QR Code Section */}
              <div className="w-1/3 bg-muted p-3 flex flex-col items-center justify-center border-r [&_path]:first:fill-transparent">
                <QRCode size={100} value={window.location.origin + `/verify-ticket/${ticket.id}`} className="mb-2" />
                <span className="text-xs text-center text-muted-foreground">#{ticket.id.substring(0, 8)}</span>
              </div>

              {/* Ticket Details Section */}
              <div className="w-2/3 flex flex-col">
                <CardContent className="p-3 pb-0 flex-grow">
                  <div className="flex flex-col items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 w-full flex justify-between">
                      <Link
                        to={`/events/${ticket.event.id}`}
                        className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
                        {ticket.event.title}
                      </Link>

                      <Badge variant="outline" className={`text-xs ${statusColors[ticket.status]}`}>
                        {ticket.status === 'VALID' && <Check className="h-2.5 w-2.5 mr-1" />}
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {dayjs(ticket.event.startDate).format('MMM D, YYYY')}
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{ticket?.event?.location?.address || 'Online'}</span>
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">Purchased {dayjs(ticket.purchaseDate).format('MMM D, YYYY')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-3 !pt-3 flex justify-between items-center border-t mt-auto">
                  <div className="font-medium text-sm">
                    {ticket.event.price > 0 ? `$${ticket.event.price.toFixed(2)}` : 'Free'}
                  </div>
                  <Link
                    to={`/events/${ticket.event.id}`}
                    className="text-xs text-primary hover:underline flex items-center">
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </div>
            </div>
          </Card>
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
