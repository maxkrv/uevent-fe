import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

import { Pagination } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { ShortCompanyCard } from '../../../company/components/short-company-card';
import { UserService } from '../../services/user.service';
import { UserNoItems } from './user-no-items';

interface UserFollowingProps {
  userId: string;
}
const ITEMS_PER_PAGE = 10;

export const UserFollowing = ({ userId }: UserFollowingProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch companies the user is following
  const { data: followedCompaniesData, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_COMPANIES, userId, 'following', currentPage],
    queryFn: () =>
      UserService.getFollowedCompanies(userId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }, (_data, i) => (
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

  if (!followedCompaniesData || followedCompaniesData?.items.length === 0) {
    return (
      <UserNoItems
        icon={Building2}
        title="No Companies Followed"
        description="This user hasn't followed any companies yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followedCompaniesData.items.map((company) => (
          <ShortCompanyCard company={company} key={company.id} />
        ))}
      </div>

      {followedCompaniesData.meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={followedCompaniesData.meta.currentPage}
            totalPages={followedCompaniesData.meta.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
