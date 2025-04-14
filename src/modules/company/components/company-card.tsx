'use client';

import { ExternalLink, MapPin, Star, Users } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

import { Link } from '../../../shared/components/common/link';
import { Separator } from '../../../shared/components/ui/separator';
import type { Company } from '../interfaces/company.interface';

interface CompanyCardProps {
  company: Company;
  isFeatured?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, isFeatured = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group border-2 hover:border-primary py-0 gap-0">
      <Link to={`/companies/${company.id}`} unstyled>
        <div className="h-40 relative overflow-hidden">
          <img
            src={
              company.coverImage ||
              `/placeholder.svg?height=160&width=400&query=event by ${encodeURIComponent(company.name) || '/placeholder.svg'}`
            }
            alt={`${company.name} featured`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 "
          />
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
            <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden bg-accent mr-3 flex-shrink-0">
              <img
                src={
                  company.logo || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(company.name)} logo`
                }
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate text-white ">{company.name}</h3>
              <div className="flex items-center text-sm text-white/90">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate ">{company.location}</span>
              </div>
            </div>
          </div>

          {isFeatured && (
            <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </div>
          )}
        </div>

        <CardContent className="p-4 flex gap-4 flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{company.subscriberCount?.toLocaleString() || 0} followers</span>
            </div>
            <div className="text-sm text-muted-foreground">{company.eventCount || 0} events</div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {company.description || 'No description available'}
          </p>
          <Separator className="border-2 rounded" />
          <div className="flex gap-2">
            <Button
              variant={isFollowing ? 'outline' : 'default'}
              size="sm"
              onClick={handleFollowClick}
              className="flex-1">
              {isFollowing ? 'Following' : 'Follow'}
            </Button>

            {company.website && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(company.website, '_blank');
                }}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
