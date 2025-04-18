'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { ShortCompanyCard } from '../../../company/components/short-company-card';
import { UserService } from '../../services/user.service';

interface UserFollowingProps {
  userId: string;
}

export const UserFollowing = ({ userId }: UserFollowingProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch companies the user is following
  const { data: followedCompaniesData, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_COMPANIES, userId, 'following'],
    queryFn: () => UserService.getFollowedCompanies(userId),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const followedCompanies = followedCompaniesData?.items || [];

  if (followedCompanies.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-screen-no-header">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Not Following Any Companies</h3>
        <p className="text-muted-foreground">This user isn&apos;t following any event organizers yet.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(followedCompanies.length / itemsPerPage);
  const paginatedCompanies = followedCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedCompanies.map((company) => (
          <ShortCompanyCard company={company} key={company.id} />
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
