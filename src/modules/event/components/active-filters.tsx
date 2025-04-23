import { FiX } from 'react-icons/fi';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface ActiveFiltersProps {
  searchQuery: string;
  onClearSearch: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const ActiveFilters = ({ searchQuery, onClearSearch, showFilters, onToggleFilters }: ActiveFiltersProps) => {
  if (!searchQuery && !showFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: {searchQuery}
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={onClearSearch}>
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {showFilters && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Filters Active
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={onToggleFilters}>
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};
