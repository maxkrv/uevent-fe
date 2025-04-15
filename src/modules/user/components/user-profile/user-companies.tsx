'use client';

import { useEffect, useState } from 'react';

import { mockCompanies } from '@/__mock__/companies';
import { mockEvents } from '@/__mock__/events';
import type { Company } from '@/modules/company/interfaces/company.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { ShortCompanyCard } from '../../../company/components/short-company-card';

interface UserCompaniesProps {
  userId: string;
}

export const UserCompanies = ({ userId }: UserCompaniesProps) => {
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCompanies = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For demo purposes, randomly select some companies as owned by this user
        // In a real app, this would be fetched from the API based on the user ID
        const randomCompanies = [...mockCompanies]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1);

        // For each company, count how many events they have
        const companiesWithEventCount = randomCompanies.map((company) => {
          const eventCount = mockEvents.filter((event) => event.company?.id === company.id).length;
          return { ...company, eventCount };
        });

        setUserCompanies(companiesWithEventCount);
      } catch (error) {
        console.error('Failed to fetch user companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCompanies();
  }, [userId]);

  if (isLoading) {
    return null;
  }

  if (userCompanies.length === 0) {
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
