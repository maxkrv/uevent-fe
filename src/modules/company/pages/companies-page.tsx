'use client';

import { useEffect, useState } from 'react';

import { mockCompanies } from '../../../__mock__/companies';
import { CompanyList } from '../components/company-list';
import { CompanySearch } from '../components/company-search';
import { CompanyStatistics } from '../components/company-statistics';
import { FeaturedCompanies } from '../components/featured-companies';
import type { Company } from '../interfaces/company.interface';

export const CompaniesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'events' | 'newest'>('newest');
  const pageSize = 9;

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle search and sorting
  useEffect(() => {
    if (!companies.length) return;

    let filtered = [...companies];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'events':
        filtered.sort((a, b) => (b.eventCount || 0) - (a.eventCount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchQuery, companies, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Organizers</h1>
        <p className="text-muted-foreground">
          Discover and follow event organizers to stay updated with their latest events
        </p>
      </div>

      {/* Statistics Section */}
      {!isLoading && <CompanyStatistics companies={companies} />}

      {/* Featured Companies Section */}
      {!isLoading && <FeaturedCompanies companies={companies} />}

      {/* Search and Filter Controls */}
      <CompanySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} />

      {/* All Companies Section */}
      <div className="mb-8">
        <CompanyList
          companies={paginatedCompanies}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
