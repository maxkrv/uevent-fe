'use client';

import { Building2, TrendingUp, Users } from 'lucide-react';

import type { Company } from '../interfaces/company.interface';

interface CompanyStatisticsProps {
  companies: Company[];
}

export const CompanyStatistics = ({ companies }: CompanyStatisticsProps) => {
  // Calculate statistics
  const totalEvents = companies.reduce((sum, company) => sum + (company.eventCount || 0), 0);
  const totalSubscribers = companies.reduce((sum, company) => sum + (company.subscriberCount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Organizers</p>
          <h3 className="text-2xl font-bold">{companies.length}</h3>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Events</p>
          <h3 className="text-2xl font-bold">{totalEvents}</h3>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Followers</p>
          <h3 className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};
