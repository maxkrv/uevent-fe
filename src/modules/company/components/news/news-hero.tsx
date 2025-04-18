'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

import { Image } from '../../../../shared/components/common/image';
import { CompanyNews } from '../../interfaces/news.interface';

interface NewsHeroProps {
  newsItem: CompanyNews;
}

export const NewsHero = ({ newsItem }: NewsHeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[40vh] overflow-hidden">
      <div className="absolute inset-0  z-10"></div>
      <Image src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover object-center" />

      <Button
        variant="link"
        size="icon"
        className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
        onClick={() => navigate(-1)}
        aria-label="Go back">
        <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
        Go Back
      </Button>
    </div>
  );
};
