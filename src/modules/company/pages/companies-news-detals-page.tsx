'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { mockCompanies } from '@/__mock__/companies';
import { Comments } from '@/modules/comments/components/comments';

import { CompanySidebar } from '../components/news/company-sidebar';
import { NewsContent } from '../components/news/news-content';
import { NewsHero } from '../components/news/news-hero';
import { NewsNotFound } from '../components/news/news-not-found';
import { NewsDetailSkeleton } from '../components/news/news-skeleton';
import { RelatedNews } from '../components/news/related-news';
import type { Company } from '../interfaces/company.interface';
import type { NewsItem } from '../interfaces/news.interface';
import { NewsService } from '../services/news.service';

export const CompanyNewsDetailPage = () => {
  const { companyId, newsId } = useParams<{ companyId: string; newsId: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId || !newsId) return;

      setIsLoading(true);
      try {
        // Find company
        const foundCompany = mockCompanies.find((c) => c.id === companyId);
        if (!foundCompany) {
          throw new Error('Company not found');
        }
        setCompany(foundCompany);

        // Get news item
        const news = await NewsService.getNewsItem(newsId, companyId);
        setNewsItem(news);

        // Get related news
        const related = await NewsService.getRelatedNews(companyId);
        setRelatedNews(related);
      } catch (error) {
        console.error('Failed to fetch news item:', error);
        toast.error('Failed to load news item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId, newsId]);

  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (!newsItem || !company) {
    return <NewsNotFound />;
  }

  return (
    <div className="bg-background min-h-screen-no-header">
      {/* Hero Section */}
      <NewsHero newsItem={newsItem} />

      <div className="container mx-auto px-4 py-8 relative -mt-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <NewsContent newsItem={newsItem} company={company} />

            {/* Comments Section */}
            <Comments eventId={`news-${newsItem.id}`} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Info */}
            <CompanySidebar company={company} />

            {/* Related News */}
            <RelatedNews companyId={company.id} relatedNews={relatedNews} />
          </div>
        </div>
      </div>
    </div>
  );
};
