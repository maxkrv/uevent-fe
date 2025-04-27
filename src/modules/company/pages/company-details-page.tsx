import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { NotFoundPage } from '../../../shared/pages/not-found-page';
import { CompanyAbout } from '../components/company-detail/company-about';
import { CompanyContact } from '../components/company-detail/company-contact';
import { CompanyHero } from '../components/company-detail/company-hero';
import { CompanyNews } from '../components/company-detail/company-news';
import { CompanyOwner } from '../components/company-detail/company-owner';
import { PastEvents } from '../components/company-detail/past-events';
import { SimilarCompanies } from '../components/company-detail/similar-companies';
import { UpcomingEvents } from '../components/company-detail/upcoming-events';
import { CompanyService } from '../services/company.service';

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    data: company,
    isLoading,
    error
  } = useQuery({
    queryKey: [QueryKeys.COMPANIES, id],
    queryFn: () => CompanyService.getById(id!),
    enabled: !!id
  });

  const { data: similarCompanies } = useQuery({
    queryKey: [QueryKeys.COMPANIES, 'similar', id],
    queryFn: () => CompanyService.getSimilarCompanies(id!),
    enabled: !!id && !!company
  });

  if (isLoading) {
    return <CompanySkeleton />;
  }

  if (error || !company) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-background min-h-screen-no-header">
      {/* Hero Section with Company Cover Image */}
      <CompanyHero company={company} />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Description */}
            <CompanyAbout description={company.description} />
            {/* Company News */}
            <CompanyNews company={company} />
            {/* Company Events */}
            <UpcomingEvents company={company} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <CompanyContact
              company={company}
              isFollowing={isFollowing}
              onFollowToggle={() => setIsFollowing(!isFollowing)}
            />

            {/* Company Stats */}
            {/* <CompanyStats company={company} /> */}
            {/* Team Members */}
            <CompanyOwner user={company.owner} />

            {/* Similar Organizers */}
            {similarCompanies && <SimilarCompanies currentCompanyId={company.id} companies={similarCompanies} />}
            <PastEvents company={company} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanySkeleton = () => (
  <div className="bg-background min-h-screen-no-header">
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
        <div className="container mx-auto flex items-end gap-6">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-8 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-16 w-24 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
