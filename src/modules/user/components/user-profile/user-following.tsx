'use client';

import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { mockCompanies } from '@/__mock__/companies';
import type { Company } from '@/modules/company/interfaces/company.interface';
import { Pagination } from '@/shared/components/ui/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { ShortCompanyCard } from '../../../company/components/short-company-card';

interface UserFollowingProps {
  userId: string;
}

export const UserFollowing = ({ userId }: UserFollowingProps) => {
  const [followedCompanies, setFollowedCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchFollowedCompanies = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 600));

        // For demo purposes, randomly select some companies as followed
        const randomCompanies = [...mockCompanies]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 10) + 5);

        setFollowedCompanies(randomCompanies);
      } catch (error) {
        console.error('Failed to fetch followed companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedCompanies();
  }, [userId]);

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

  if (followedCompanies.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-screen-no-header">
        {' '}
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Not Following Any Companies</h3>
        <p className="text-muted-foreground">This user isn&apos;t following any event organizers yet.</p>
      </div>
    );
  }

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
