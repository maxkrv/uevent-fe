'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useShare } from '@/shared/hooks/use-share';
import dayjs from '@/shared/lib/dayjs';

import type { Company } from '../../interfaces/company.interface';
import { NewsCard } from '../news/news-card';

// Update the NewsItem interface to match the Prisma schema
interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;

  // Additional frontend properties (not in DB schema)
  isLiked?: boolean;
  likes?: number;
  comments?: number;
}

interface CompanyNewsProps {
  company: Company;
}

export const CompanyNews = ({ company }: CompanyNewsProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const share = useShare();

  // Update the mock data generation in the useEffect
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Generate mock news items based on the Prisma schema
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: `${company.name} Announces New Event Series`,
            content:
              "We're excited to announce our new quarterly event series focusing on industry trends and networking opportunities. Join us for insightful discussions, expert panels, and valuable networking with professionals in your field. Our first event will take place next month and registration is now open on our website.",
            imageUrl: '/community-gathering.png',
            createdAt: dayjs().subtract(2, 'day').toISOString(),
            updatedAt: dayjs().subtract(2, 'day').toISOString(),
            companyId: company.id,
            likes: 24,
            comments: 5
          },
          {
            id: '2',
            title: 'Press Release: Partnership with Industry Leaders',
            content:
              "We're proud to announce our strategic partnership with leading organizations to bring you even better events and experiences. This collaboration will allow us to offer enhanced content, broader networking opportunities, and access to exclusive resources. Stay tuned for special joint events coming soon.",
            imageUrl: '/placeholder.svg',
            createdAt: dayjs().subtract(1, 'week').toISOString(),
            updatedAt: dayjs().subtract(1, 'week').toISOString(),
            companyId: company.id,
            likes: 42,
            comments: 8
          },
          {
            id: '3',
            title: 'Platform Updates: New Features for Event Attendees',
            content:
              "We've updated our platform with new features to enhance your event experience, including improved mobile check-in and personalized recommendations. Our team has been working hard to implement these changes based on your feedback. The updates are now live and ready for you to explore.",
            imageUrl: '/digital-update-flow.png',
            createdAt: dayjs().subtract(2, 'week').toISOString(),
            updatedAt: dayjs().subtract(2, 'week').toISOString(),
            companyId: company.id,
            likes: 18,
            comments: 3
          },
          {
            id: '4',
            title: `${company.name} Celebrates Milestone of 100+ Events`,
            content:
              "We're thrilled to announce that we've successfully organized over 100 events since our inception, bringing together thousands of professionals. This milestone represents our commitment to creating valuable experiences and fostering community connections. We want to thank all our attendees, speakers, and partners who made this possible.",
            imageUrl: '/golden-anniversary-toast.png',
            createdAt: dayjs().subtract(1, 'month').toISOString(),
            updatedAt: dayjs().subtract(1, 'month').toISOString(),
            companyId: company.id,
            likes: 87,
            comments: 12
          },
          {
            id: '5',
            title: 'Upcoming: Annual Industry Conference',
            content:
              "Mark your calendars for our annual industry conference, featuring keynote speakers, workshops, and networking opportunities. This year's theme focuses on innovation and adaptation in a changing landscape. Early bird registration is now open with special pricing available for the first 100 tickets.",
            createdAt: dayjs().subtract(3, 'week').toISOString(),
            updatedAt: dayjs().subtract(3, 'week').toISOString(),
            companyId: company.id,
            likes: 35,
            comments: 7
          }
        ];

        setNewsItems(mockNews);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [company.id, company.name]);

  const handleLike = (id: string) => {
    setNewsItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? (item.likes || 0) - 1 : (item.likes || 0) + 1
            }
          : item
      )
    );
    toast.success('Reaction saved');
  };

  // Update the handleShare function
  const handleShare = (item: NewsItem) => {
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

  // Update the CardHeader and Tabs section
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

          {newsItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No news items available.</p>
            </div>
          )}

          {newsItems.length > 5 && (
            <Button variant="outline" className="w-full">
              Load More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
