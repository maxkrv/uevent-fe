'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { Comments } from '@/modules/comments/components/comments';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { CompanyCard } from '../components/company-card';
import { NewsContent } from '../components/news/news-content';
import { NewsHero } from '../components/news/news-hero';
import { NewsNotFound } from '../components/news/news-not-found';
import { NewsDetailSkeleton } from '../components/news/news-skeleton';
import { RelatedNews } from '../components/news/related-news';
import { CompanyService } from '../services/company.service';

export const CompanyNewsDetailPage = () => {
  const { companyId, newsId } = useParams<{ companyId: string; newsId: string }>();

  // Fetch company data
  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: [QueryKeys.COMPANIES, companyId],
    queryFn: () => CompanyService.getById(companyId!),
    enabled: !!companyId
  });

  // Fetch news item
  const { data: newsItem, isLoading: isNewsLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, companyId, newsId],
    queryFn: () => CompanyService.getNewsItem(newsId!, companyId!),
    enabled: !!companyId && !!newsId
  });

  // Fetch related news
  const { data: relatedNews, isLoading: isRelatedLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, companyId, 'related', newsId],
    queryFn: () => CompanyService.getRelatedNews(companyId!, newsId),
    enabled: !!companyId && !!newsId
  });

  const isLoading = isCompanyLoading || isNewsLoading || isRelatedLoading;

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
            <Comments newsId={newsItem.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Info */}
            <CompanyCard company={company} />

            {/* Related News */}
            {relatedNews && relatedNews.length > 0 && <RelatedNews companyId={company.id} relatedNews={relatedNews} />}
          </div>
        </div>
      </div>
    </div>
  );
};
