'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { mockCompanies } from '@/__mock__/companies';
import { mockEvents } from '@/__mock__/events';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { mockUsers } from '../../../__mock__/users';
import { NotFoundPage } from '../../../shared/pages/not-found-page';
import type { Event } from '../../event/interfaces/event.interface';
import { CompanyAbout } from '../components/company-detail/company-about';
import { CompanyContact } from '../components/company-detail/company-contact';
import { CompanyEvents } from '../components/company-detail/company-events';
import { CompanyHero } from '../components/company-detail/company-hero';
import { CompanyNews } from '../components/company-detail/company-news';
import { CompanyOwner } from '../components/company-detail/company-owner';
import { CompanyStats } from '../components/company-detail/company-stats';
import { SimilarCompanies } from '../components/company-detail/similar-companies';
import type { Company } from '../interfaces/company.interface';

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyEvents, setCompanyEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Simulate fetching company data
  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundCompany = mockCompanies.find((c) => c.id === id);
        setCompany(foundCompany || null);

        // Get events organized by this company
        if (foundCompany) {
          const events = mockEvents.filter((event) => event.company?.id === foundCompany.id);
          setCompanyEvents(events);
        }
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (isLoading) {
    return <CompanySkeleton />;
  }

  if (!company) {
    return <NotFoundPage />;
  }

  // Get upcoming events count
  const upcomingEvents = companyEvents.filter((event) => new Date(event.startDate) > new Date());
  const pastEvents = companyEvents.filter((event) => new Date(event.startDate) <= new Date());

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
            <CompanyEvents events={upcomingEvents} companyId={company.id} title="Upcoming Events" />
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
            <CompanyStats
              company={company}
              upcomingEventsCount={upcomingEvents.length}
              totalEventsCount={companyEvents.length}
            />
            {/* Team Members */}
            <CompanyOwner user={mockUsers.at(0)} />

            {/* Similar Organizers */}
            <SimilarCompanies currentCompanyId={company.id} companies={mockCompanies} />
            <CompanyEvents events={pastEvents} companyId={company.id} title="Past Events" />
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
