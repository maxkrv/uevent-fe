import { Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import dayjs from '@/shared/lib/dayjs';

import type { Company } from '../../interfaces/company.interface';

interface CompanyStatsProps {
  company: Company;
  upcomingEventsCount: number;
  totalEventsCount: number;
}

export const CompanyStats = ({ company, upcomingEventsCount, totalEventsCount }: CompanyStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Organizer Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since:</span>
            <span className="font-medium">
              {company.createdAt ? dayjs(company.createdAt).format('MMMM YYYY') : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total events:</span>
            <span className="font-medium">{totalEventsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Followers:</span>
            <span className="font-medium">{company.subscribers?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Upcoming events:</span>
            <span className="font-medium">{upcomingEventsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
