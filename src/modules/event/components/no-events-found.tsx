import { FiCalendar } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';

export const NoEventsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <FiCalendar className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Events Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn&apos;t find any events matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset Filters
        </Button>
        <Button>Browse All Events</Button>
      </div>
    </div>
  );
};
