import type { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/avatar';
import { cn } from '../../../shared/lib/utils';
import type { Company } from '../interfaces/company.interface';

interface CompanyLogoProps {
  company?: Company | null;
  className?: string;
}
const getInitials = (fullName?: string) => {
  if (!fullName) return '';

  return (
    fullName
      .split(' ') // Split by space
      .filter(Boolean) // Remove empty strings
      .map((name) => name[0].toUpperCase()) // Take first character, capitalize
      .slice(0, 2) // Take first two initials
      .join('') || ''
  ); // Join into initials
};
export const CompanyLogo: FC<CompanyLogoProps> = ({ className, company }) => {
  return (
    <Avatar className={cn('bg-muted border-2', className)}>
      <AvatarImage src={company?.logo || ''} alt={company?.name} className="object-cover object-center" />
      <AvatarFallback className="uppercase">{!company?.logo && `${getInitials(company?.name)}`}</AvatarFallback>
    </Avatar>
  );
};
