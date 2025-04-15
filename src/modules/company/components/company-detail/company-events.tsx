'use client';

import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { ShortEventCard } from '../../../event/components/short-event-card';
import type { Event } from '../../../event/interfaces/event.interface';

interface CompanyEventsProps {
  events: Event[];
  title: string;
  companyId: string;
}

export const CompanyEvents = ({ events, companyId, title }: CompanyEventsProps) => {
  const nav = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <ShortEventCard key={event.id} event={event} className="border-transparent" />
            ))}
            <Button variant="outline" className="w-full" onClick={() => nav(`/events?company=${companyId}`)}>
              View All Events
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No events scheduled.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
