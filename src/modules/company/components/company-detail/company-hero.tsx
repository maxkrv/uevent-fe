'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { FaCalendarDays, FaLocationDot, FaRegUser } from 'react-icons/fa6';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { useShare } from '@/shared/hooks/use-share';

import type { Company } from '../../interfaces/company.interface';

interface CompanyHeroProps {
  company: Company;
}

export const CompanyHero = ({ company }: CompanyHeroProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const nav = useNavigate();
  const share = useShare();

  const handleShare = () => {
    share({
      title: company.name,
      text: `Check out this event organizer: ${company.name}`,
      url: window.location.href
    });
  };

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      <div className="absolute inset-0 z-10"></div>
      <img
        src={
          company.coverImage ||
          `/placeholder.svg?height=600&width=1200&query=${encodeURIComponent(company.name) || '/placeholder.svg'} headquarters`
        }
        alt={company.name}
        className="w-full h-full object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white">
        <div className="container mx-auto flex items-end gap-6">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background overflow-hidden bg-accent shadow-lg">
            <img
              src={
                company.logo || `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(company.name)} logo`
              }
              alt={company.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 gap-2 grid">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{company.name}</h1>
            <CompanyHeroStats company={company} />
          </div>
        </div>
      </div>

      <Button
        variant="link"
        size="icon"
        className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
        onClick={() => nav(-1)}
        aria-label="Go back">
        <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
        Go Back
      </Button>
      <div className="flex space-x-2 absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size={'icon'}
          className="text-white/90 hover:text-red-700/80 hover:bg-red-500/30 transition-colors duration-300 hover:border-red-700/80"
          onClick={() => setIsFollowing(!isFollowing)}
          aria-pressed={isFollowing}
          aria-label="Follow organizer">
          <FiHeart className="size-6" fill={isFollowing ? 'currentColor' : 'none'} />
        </Button>
        <Button
          variant="ghost"
          size={'icon'}
          onClick={handleShare}
          className="text-white/90 hover:text-primary hover:bg-primary/30 transition-colors duration-300"
          aria-label="Share organizer">
          <FiShare2 className="size-6" />
        </Button>
      </div>
    </div>
  );
};

interface CompanyHeroStatsProps {
  company: Company;
}

const CompanyHeroStats = ({ company }: CompanyHeroStatsProps) => {
  const { location, eventCount = 0, subscriberCount = 0 } = company;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
      {location && (
        <div className="flex items-center">
          <FaLocationDot className="mr-2 h-5 w-5" />
          <span>{location}</span>
        </div>
      )}
      <div className="flex items-center">
        <FaCalendarDays className="mr-2 h-5 w-5" />
        <span>{eventCount} Events</span>
      </div>
      <div className="flex items-center">
        <FaRegUser className="mr-2 h-5 w-5" />

        <span>{subscriberCount.toLocaleString()} Followers</span>
      </div>
    </div>
  );
};
