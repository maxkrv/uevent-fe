import { Link } from '@/shared/components/common/link';
import { Button } from '@/shared/components/ui/button';

import type { Company } from '../../interfaces/company.interface';

interface CompanySidebarProps {
  company: Company;
}

export const CompanySidebar = ({ company }: CompanySidebarProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={company.logo || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(company.name)} logo`}
          alt={company.name}
          className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
        />
        <div>
          <h3 className="font-bold">{company.name}</h3>
          <p className="text-sm text-muted-foreground">{company.location}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {company.description || 'No description available'}
      </p>

      <Link to={`/companies/${company.id}`} className="w-full">
        <Button variant="outline" className="w-full">
          View Company Profile
        </Button>
      </Link>
    </div>
  );
};
