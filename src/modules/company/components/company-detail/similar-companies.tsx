import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { Company } from '../../interfaces/company.interface';
import { ShortCompanyCard } from '../short-company-card';

interface SimilarCompaniesProps {
  currentCompanyId: string;
  companies: Company[];
}

export const SimilarCompanies = ({ currentCompanyId, companies }: SimilarCompaniesProps) => {
  // Filter out current company and limit to 3
  const similarCompanies = companies.filter((c) => c.id !== currentCompanyId).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Companies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarCompanies.map((company) => (
          <ShortCompanyCard key={company.id} company={company} className="border-transparent" />
        ))}
      </CardContent>
    </Card>
  );
};
