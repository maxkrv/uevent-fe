'use client';

import { Calendar, Share2, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Link } from '@/shared/components/common/link';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '@/shared/hooks/use-share';
import dayjs from '@/shared/lib/dayjs';

import type { Company } from '../../interfaces/company.interface';
import type { NewsItem } from '../../interfaces/news.interface';

interface NewsContentProps {
  newsItem: NewsItem;
  company: Company;
}

export const NewsContent = ({ newsItem, company }: NewsContentProps) => {
  const [isLiked, setIsLiked] = useState(newsItem.isLiked || false);
  const [likes, setLikes] = useState(newsItem.likes || 0);
  const share = useShare();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
    toast.success(isLiked ? 'Like removed' : 'News liked');
  };

  const handleShare = () => {
    share({
      title: newsItem.title,
      text: newsItem.content.substring(0, 100) + '...',
      url: window.location.href
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 border shadow-md">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
        <span>{dayjs(newsItem.createdAt).format('MMMM D, YYYY')}</span>

        <Link to={`/companies/${company.id}`} className="ml-auto flex items-center gap-1">
          <img
            src={
              company.logo ||
              `/placeholder.svg?height=24&width=24&query=${encodeURIComponent(company.name) || '/placeholder.svg'} logo`
            }
            alt={company.name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span>{company.name}</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">{newsItem.title}</h1>

      <div className="prose max-w-none">
        {newsItem.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-8 pt-4 border-t">
        <Button
          variant={isLiked ? 'default' : 'outline'}
          size="sm"
          onClick={handleLike}
          className={isLiked ? 'bg-primary/20 hover:bg-primary/30 text-primary' : ''}>
          <ThumbsUp className="h-4 w-4 mr-2" />
          {isLiked ? 'Liked' : 'Like'} ({likes})
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};
