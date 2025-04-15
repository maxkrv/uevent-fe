import { Calendar, Check, Clock, MapPin, Ticket } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Event } from '@/modules/event/interfaces/event.interface';
import { Badge } from '@/shared/components/ui/badge';
import { Pagination } from '@/shared/components/ui/pagination';
import dayjs from '@/shared/lib/dayjs';

// Mock ticket interface
interface UserTicket {
  id: string;
  eventId: string;
  event: Event;
  purchaseDate: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  ticketNumber: string;
  price: number;
}

interface UserTicketsProps {
  events: Event[];
}

export const UserTickets = ({ events }: UserTicketsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Generate mock tickets from events
  const mockTickets: UserTicket[] = events.map((event, index) => {
    // Random purchase date between event creation and start date
    const purchaseDate = dayjs(event.startDate)
      .subtract(Math.floor(Math.random() * 30) + 1, 'day')
      .toISOString();

    // Determine status based on event date
    let status: UserTicket['status'] = 'active';
    if (dayjs(event.endDate || event.startDate).isBefore(dayjs())) {
      status = 'used';
    } else if (Math.random() > 0.9) {
      status = 'cancelled';
    }

    return {
      id: `ticket-${index}-${event.id}`,
      eventId: event.id,
      event,
      purchaseDate,
      status,
      ticketNumber: `T-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      price: event.price || 0
    };
  });

  // Sort tickets by purchase date (newest first)
  const sortedTickets = [...mockTickets].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  const paginatedTickets = sortedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (sortedTickets.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-screen-no-header">
        {' '}
        <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Tickets Found</h3>
        <p className="text-muted-foreground">You haven&apos;t purchased any tickets yet.</p>
      </div>
    );
  }

  // Status badge colors
  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    used: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    expired: 'bg-red-500/10 text-red-600 border-red-500/20',
    cancelled: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {paginatedTickets.map((ticket) => (
          <div key={ticket.id} className="bg-card rounded-lg border p-4 hover:border-primary transition-colors">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="h-24 w-full md:w-24 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={
                    ticket.event.poster ||
                    `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(ticket.event.title)}`
                  }
                  alt={ticket.event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <Link to={`/events/${ticket.event.id}`} className="font-medium hover:text-primary transition-colors">
                    {ticket.event.title}
                  </Link>
                  <Badge variant="outline" className={statusColors[ticket.status]}>
                    {ticket.status === 'active' && <Check className="h-3 w-3 mr-1" />}
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
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
                    Ticket #{ticket.ticketNumber}
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Purchased {dayjs(ticket.purchaseDate).format('MMM D, YYYY')}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="font-medium">{ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : 'Free'}</div>
                  <Link to={`/events/${ticket.event.id}`} className="text-sm text-primary hover:underline">
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};
