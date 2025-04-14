'use client';

import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { Company } from '../../interfaces/company.interface';

interface SimilarCompaniesProps {
  currentCompanyId: string;
  companies: Company[];
}

export const SimilarCompanies = ({ currentCompanyId, companies }: SimilarCompaniesProps) => {
  const nav = useNavigate();

  // Filter out current company and limit to 3
  const similarCompanies = companies.filter((c) => c.id !== currentCompanyId).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Organizers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarCompanies.map((company) => (
          <div
            key={company.id}
            className="flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors cursor-pointer"
            onClick={() => nav(`/companies/${company.id}`)}>
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 relative">
              <img
                src={
                  company.logo ||
                  `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(company.name) || '/placeholder.svg'} logo`
                }
                alt={company.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="mr-1 h-3 w-3" />
                {company.location || 'Unknown location'}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
