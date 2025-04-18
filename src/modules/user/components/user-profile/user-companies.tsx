'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { ShortCompanyCard } from '../../../company/components/short-company-card';
import { UserService } from '../../services/user.service';

interface UserCompaniesProps {
  userId: string;
}

export const UserCompanies = ({ userId }: UserCompaniesProps) => {
  // Fetch companies owned by the user
  const { data: userCompanies, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_COMPANIES, userId],
    queryFn: () => UserService.getOwnedCompanies(userId),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!userCompanies || userCompanies.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Companies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userCompanies.map((company) => (
          <ShortCompanyCard key={company.id} company={company} className="border-transparent" />
        ))}
      </CardContent>
    </Card>
  );
};
