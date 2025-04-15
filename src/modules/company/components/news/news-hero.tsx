'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

import type { NewsItem } from '../../interfaces/news.interface';

interface NewsHeroProps {
  newsItem: NewsItem;
}

export const NewsHero = ({ newsItem }: NewsHeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[40vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10"></div>
      <img
        src={newsItem.imageUrl || `/placeholder.svg?height=600&width=1200&query=company news`}
        alt={newsItem.title}
        className="w-full h-full object-cover object-center"
      />

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
