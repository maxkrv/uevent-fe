import dayjs from '@/shared/lib/dayjs';

import type { NewsItem } from '../interfaces/news.interface';

export class NewsService {
  /**
   * Get a single news item by ID
   */
  static async getNewsItem(newsId: string, companyId: string): Promise<NewsItem> {
    // In a real app, this would be an API call
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: newsId,
      title: 'Company Announces New Event Series',
      content: `We're excited to announce our new quarterly event series focusing on industry trends and networking opportunities.

What to Expect

Our upcoming series will feature industry experts, interactive workshops, and valuable networking sessions. Each event will focus on a specific theme relevant to current market trends and challenges.

Key Highlights:

- Expert Speakers: Learn from industry leaders and innovators
- Interactive Workshops: Gain practical skills through hands-on sessions
- Networking Opportunities: Connect with professionals in your field
- Resource Materials: Access exclusive content and tools

Upcoming Events

Our first event will take place next month at our downtown venue. Early bird registration is now open with special pricing available for the first 100 tickets.

We've carefully curated the content to ensure it provides actionable insights that you can immediately apply to your work. Whether you're a seasoned professional or just starting your career, there's something valuable for everyone.

Why Attend?

In today's rapidly evolving landscape, staying updated with the latest trends and expanding your professional network is more important than ever. Our events provide a platform for both learning and connection, helping you stay ahead in your career.

We look forward to seeing you at our upcoming events and being part of your professional growth journey.`,
      imageUrl: '/community-gathering.png',
      createdAt: dayjs().subtract(2, 'day').toISOString(),
      updatedAt: dayjs().subtract(2, 'day').toISOString(),
      companyId: companyId,
      likes: 24,
      comments: 5
    };
  }

  /**
   * Get related news items for a company
   */
  static async getRelatedNews(companyId: string): Promise<NewsItem[]> {
    // In a real app, this would be an API call
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: '1',
        title: 'Platform Updates for Event Organizers',
        content: "We've updated our platform with new features...",
        imageUrl: '/breaking-news-desk.png',
        createdAt: dayjs().subtract(1, 'week').toISOString(),
        updatedAt: dayjs().subtract(1, 'week').toISOString(),
        companyId,
        likes: 15,
        comments: 3
      },
      {
        id: '2',
        title: 'Celebrating Our Community Milestone',
        content: "We're thrilled to announce that we've reached...",
        imageUrl: '/breaking-news-desk.png',
        createdAt: dayjs().subtract(2, 'week').toISOString(),
        updatedAt: dayjs().subtract(2, 'week').toISOString(),
        companyId,
        likes: 32,
        comments: 7
      },
      {
        id: '3',
        title: 'Upcoming Industry Conference Announced',
        content: 'Mark your calendars for our annual industry conference...',
        imageUrl: '/breaking-news-desk.png',
        createdAt: dayjs().subtract(3, 'week').toISOString(),
        updatedAt: dayjs().subtract(3, 'week').toISOString(),
        companyId,
        likes: 18,
        comments: 4
      }
    ];
  }
}
