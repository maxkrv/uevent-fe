'use client';

import type React from 'react';
import { useState } from 'react';

import { Link } from '../../../shared/components/common/link';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { Company } from '../../company/interfaces/company.interface';

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp',
    description: 'Leading provider of tech conferences and workshops',
    logo: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'info@techcorp.com',
    website: 'https://techcorp.com'
  },
  {
    id: '2',
    name: 'SoundWave Productions',
    description: 'Music festival and concert organizers',
    logo: 'https://randomuser.me/api/portraits/women/2.jpg',
    email: 'events@soundwave.com',
    website: 'https://soundwave.com'
  },
  {
    id: '3',
    name: 'Metropolitan Gallery',
    description: 'Art exhibitions and cultural events',
    logo: 'https://randomuser.me/api/portraits/women/3.jpg',
    email: 'gallery@metropolitan.com',
    website: 'https://metropolitan.com'
  },
  {
    id: '4',
    name: 'Venture Accelerator',
    description: 'Startup and entrepreneurship events',
    logo: 'https://randomuser.me/api/portraits/men/4.jpg',
    email: 'hello@venture.com',
    website: 'https://venture.com'
  },
  {
    id: '5',
    name: 'Gourmet Events',
    description: 'Food festivals and culinary experiences',
    logo: 'https://randomuser.me/api/portraits/women/5.jpg',
    email: 'taste@gourmet.com',
    website: 'https://gourmet.com'
  }
];

const FeaturedOrganizers: React.FC = () => {
  const [companies] = useState<Company[]>(mockCompanies);
  const [isLoading] = useState(false);

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold  mb-2">Featured Organizers</h2>
          <p className="text-muted-foreground">Discover top event creators and follow their upcoming events</p>
        </div>

        <Link to="/organizers" className="text-lg font-semibold" withArrow>
          View All Organizers
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className=" rounded-xl p-6 shadow-lg">
              <Skeleton className="flex items-center mb-4">
                <Skeleton className="w-12 h-12 rounded-full mr-4"></Skeleton>
                <Skeleton className="h-5  rounded w-24"></Skeleton>
              </Skeleton>
              <Skeleton className="h-4  rounded mb-2 w-full"></Skeleton>
              <Skeleton className="h-4  rounded w-3/4"></Skeleton>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center mb-4">
                <img
                  src={company.logo || '/images/company-placeholder.jpg'}
                  alt={company.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2  border-primary"
                />
                <h3 className="font-bold ">{company.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{company.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 50) + 1} Events</span>
                <Link to={`/organizers/${company.id}`}>Follow</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedOrganizers;
