import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../../shared/constants/query-keys';
import { ShortEventCard } from '../../../event/components/short-event-card';
import { Event } from '../../../event/interfaces/event.interface';
import { CompanyService } from '../../services/company.service';

interface CompanyEventsProps {
  events: Event[];
  title: string;
  companyId: string;
}

export const CompanyEvents = ({ events, companyId, title }: CompanyEventsProps) => {
  const nav = useNavigate();

  // If events are already provided, use them
  // Otherwise, fetch them from the API
  const { data: fetchedEvents, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_EVENTS, companyId, title === 'Upcoming Events'],
    queryFn: () => CompanyService.getCompanyEvents(companyId, title === 'Upcoming Events'),
    enabled: !events || events.length === 0
  });

  const displayEvents = events?.length > 0 ? events : fetchedEvents?.items || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No events scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEvents.slice(0, 3).map((event) => (
            <ShortEventCard key={event.id} event={event} className="border-transparent" />
          ))}
          <Button variant="outline" className="w-full" onClick={() => nav(`/events?company=${companyId}`)}>
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
