import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { QueryKeys } from '@/shared/constants/query-keys';

import { CompanyList } from '../components/company-list';
import { CreateCompanyModal } from '../components/modal/create-company-modal';
import { CompanyService } from '../services/company.service';

export const MyCompaniesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.MY_COMPANIES],
    queryFn: () => CompanyService.getMyCompanies()
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid items-center justify-center">
          <h1 className="text-3xl font-bold mb-2 text-center">My Companies</h1>

          <Button onClick={() => setOpen(true)}>
            <Plus />
            Create Company
          </Button>
        </div>

        <div className="mb-8">
          <CompanyList
            companies={data?.items || []}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={data?.meta.totalPages || 1}
            onPageChange={handlePageChange}
            hasHeader={false}
            hasFollow={false}
          />
        </div>
      </div>

      <CreateCompanyModal open={open} setOpen={setOpen} />
    </>
  );
};
