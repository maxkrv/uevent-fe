import { Search, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';

import { Link } from '../../../../shared/components/common/link';
import { Pagination } from '../../../../shared/components/common/pagination';
import type { User } from '../../../user/interfaces/user.interface';
import { EventAttendee } from './event-attendee';

interface EventAttendeesProps {
  attendees?: User[];
  maxAttendees?: number;
  currentAttendees?: number;
}

export const EventAttendees = ({ attendees, maxAttendees, currentAttendees = 0 }: EventAttendeesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const attendancePercentage =
    maxAttendees && currentAttendees !== undefined ? Math.round((currentAttendees / maxAttendees) * 100) : 0;

  const filteredAttendees = searchQuery
    ? attendees?.filter((attendee) => attendee.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : attendees;

  if (!attendees?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Attendees
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No attendees yet. Be the first to join!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2 grow">
            <Users className="h-5 w-5 text-primary" />
            Attendees
            <Badge variant="outline" className="ml-2">
              {currentAttendees}
            </Badge>
          </CardTitle>

          <div className="relative basis-40 grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 gap-2 flex flex-col">
        {maxAttendees && currentAttendees !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {currentAttendees} of {maxAttendees} spots filled
              </span>
              <span className="font-medium">{maxAttendees - currentAttendees} remaining</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
          </div>
        )}

        <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fill,_6.5rem)] grid-rows-[auto] justify-center gap-2">
          {filteredAttendees?.map((attendee) => (
            <Link key={attendee.id} to={`/users/${attendee.id}`} unstyled>
              <EventAttendee attendee={attendee} />
            </Link>
          ))}
        </div>

        <Pagination currentPage={17} totalPages={80} onPageChange={() => {}} />
      </CardContent>
    </Card>
  );
};
