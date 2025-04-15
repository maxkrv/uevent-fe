import { ArrowRight, Building2, MapPin } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import { cn } from '../../../shared/lib/utils';
import type { Company } from '../interfaces/company.interface';

interface ShortCompanyCardProps extends Partial<ComponentProps<typeof Link>> {
  company: Company;
}

export const ShortCompanyCard: FC<ShortCompanyCardProps> = ({ company, className, ...props }) => {
  return (
    <Link
      to={`/companies/${company.id}`}
      unstyled
      {...props}
      className={cn(
        'flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors border hover:border-primary',
        className
      )}>
      <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 relative border border-border">
        <img
          src={company.logo || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(company.name)} logo`}
          alt={company.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{company.name}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="truncate">{company.location || 'No location'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            <Building2 className="h-3 w-3 mr-1" />
            {company.eventCount || 0} events
          </Badge>
          {company.subscriberCount && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
              {company.subscriberCount.toLocaleString()} followers
            </Badge>
          )}
        </div>
      </div>
      <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-primary" />
      </div>
    </Link>
  );
};
