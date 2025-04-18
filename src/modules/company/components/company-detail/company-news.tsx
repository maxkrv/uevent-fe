'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useShare } from '@/shared/hooks/use-share';

import { QueryKeys } from '../../../../shared/constants/query-keys';
import type { Company } from '../../interfaces/company.interface';
import type { CompanyNews as News } from '../../interfaces/news.interface';
import { CompanyService } from '../../services/company.service';
import { NewsCard } from '../news/news-card';

interface CompanyNewsProps {
  company: Company;
}

export const CompanyNews = ({ company }: CompanyNewsProps) => {
  const [page, setPage] = useState(1);
  const share = useShare();

  // Fetch company news
  const { data: newsData, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, company.id, page],
    queryFn: () => CompanyService.getCompanyNews(company.id),
    enabled: !!company.id
  });

  const handleLike = (_id: string) => {
    // In a real app, this would call an API to like/unlike the news item
    toast.success('Reaction saved');
  };

  const handleShare = (item: News) => {
    share({
      title: item.title,
      text: item.content,
      url: window.location.href
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company News</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const newsItems = newsData?.items || [];

  if (newsItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company News</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No News Available</h3>
          <p className="text-muted-foreground">This organizer hasn&apos;t posted any news yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Company News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {newsItems.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              className="border-transparent"
              companyId={company.id}
              onLike={() => handleLike(item.id)}
              onShare={() => handleShare(item)}
            />
          ))}

          {newsData && newsData.meta.totalPages > 1 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPage((prev) => Math.min(prev + 1, newsData.meta.totalPages))}
              disabled={page >= newsData.meta.totalPages}>
              Load More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
