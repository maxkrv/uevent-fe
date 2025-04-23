import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { CompanyList } from '../components/company-list';
import { CompanySearch } from '../components/company-search';
import { CompanyStatistics } from '../components/company-statistics';
import { FeaturedCompanies } from '../components/featured-companies';
import { CompanyService } from '../services/company.service';

export const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'events' | 'newest'>('newest');
  const pageSize = 9;

  // Fetch companies with React Query
  const { data: companiesData, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANIES, { search: searchQuery, sortBy, page: currentPage, limit: pageSize }],
    queryFn: () =>
      CompanyService.getMany({
        search: searchQuery,
        sortBy,
        page: currentPage,
        limit: pageSize
      })
  });

  // Fetch all companies for statistics and featured companies
  const { data: allCompaniesData, isLoading: isLoadingAll } = useQuery({
    queryKey: [QueryKeys.COMPANIES, 'all'],
    queryFn: () => CompanyService.getMany({ limit: 100 }),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Event Organizers</h1>
        <p className="text-muted-foreground">
          Discover and follow event organizers to stay updated with their latest events
        </p>
      </div>

      {/* Statistics Section */}
      {!isLoadingAll && allCompaniesData && <CompanyStatistics companies={allCompaniesData.items} />}

      {/* Featured Companies Section */}
      {!isLoadingAll && allCompaniesData && <FeaturedCompanies companies={allCompaniesData.items} />}

      {/* Search and Filter Controls */}
      <CompanySearch
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* All Companies Section */}
      <div className="mb-8">
        <CompanyList
          companies={companiesData?.items || []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={companiesData?.meta.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
