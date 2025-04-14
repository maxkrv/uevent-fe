'use client';

import { ExternalLink, Mail, Star } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

import { Link } from '../../../../shared/components/common/link';
import type { Company } from '../../../company/interfaces/company.interface';

interface EventOrganizerProps {
  company: Company;
}

export const EventOrganizer = ({ company }: EventOrganizerProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data for organizer stats
  const organizerStats = {
    eventsHosted: Math.floor(Math.random() * 50) + 5,
    rating: (Math.random() * 2 + 3).toFixed(1) // Random rating between 3.0 and 5.0
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-border">
            <AvatarImage src={company.logo || '/placeholder.svg?height=56&width=56'} alt={company.name} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {company.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold">{company.name}</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Organizer
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                <span>{organizerStats.rating}</span>
              </div>
              <span className="mx-1.5">•</span>
              <span>{organizerStats.eventsHosted} events</span>
            </div>
          </div>

          <Button variant={isFollowing ? 'outline' : 'default'} size="sm" onClick={() => setIsFollowing(!isFollowing)}>
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>

        {company.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{company.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-3 *:grow">
          {company.email && (
            <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${company.email}`, '_blank')}>
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Contact
            </Button>
          )}

          {company.website && (
            <Button variant="outline" size="sm" onClick={() => window.open(company.website, '_blank')}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Website
            </Button>
          )}

          <Link to={`/organizers/${company.id}`} unstyled className={buttonVariants({ variant: 'outline' })}>
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
