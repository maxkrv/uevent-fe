import { mockCompanies } from '../../../__mock__/companies';
import { mockData } from '../../../__mock__/data';
import { mockEvents } from '../../../__mock__/events';
import type { SortOrder } from '../../../shared/types/interfaces';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import { Event } from '../../event/interfaces/event.interface';
import type { Company } from '../interfaces/company.interface';
import type { CompanyNews } from '../interfaces/news.interface';

export interface CompanyGetManyDto extends PaginationDto {
  search?: string;
  sortBy?: 'name' | 'events' | 'newest';
  sortOrder?: SortOrder;
}

export class CompanyService {
  static getById(id: string): Promise<Company> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const company = mockCompanies.find((company) => company.id === id);
        if (company) {
          resolve(company);
        } else {
          reject(new Error('Company not found'));
        }
      }, 1000);
    });
    // In a real implementation, this would be:
    // return apiClient.get(`/companies/${id}`).json<Company>();
  }

  static getMany(opt: CompanyGetManyDto): Promise<Paginated<Company>> {
    // In a real implementation, this would be:
    // return apiClient.get('/companies', { json: opt }).json<Paginated<Company>>();

    return new Promise((resolve) => {
      setTimeout(() => {
        // Apply filters to the mock data
        let filteredCompanies = [...mockCompanies];

        // Apply search filter
        if (opt.search) {
          const searchLower = opt.search.toLowerCase();
          filteredCompanies = filteredCompanies.filter(
            (company) =>
              company.name.toLowerCase().includes(searchLower) ||
              (company.description && company.description.toLowerCase().includes(searchLower)) ||
              (company.location && company.location.address.toLowerCase().includes(searchLower))
          );
        }

        // Apply sorting
        if (opt.sortBy) {
          filteredCompanies.sort((a, b) => {
            switch (opt.sortBy) {
              case 'name':
                return a.name.localeCompare(b.name);
              case 'events':
                return (
                  mockEvents.filter((event) => event.company?.id === b.id).length -
                  mockEvents.filter((event) => event.company?.id === a.id).length
                );
              case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              default:
                return 0;
            }
          });

          // Apply sort order
          if (opt.sortOrder === 'asc' && opt.sortBy !== 'events') {
            filteredCompanies.reverse();
          }
        }

        // Apply pagination
        const page = opt.page || 1;
        const limit = opt.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

        // Add event count and subscriber count to each company
        const companiesWithCounts = paginatedCompanies.map((company) => {
          const eventCount = mockEvents.filter((event) => event.company?.id === company.id).length;
          const subscriberCount = company.subscribers?.length || 0;

          return {
            ...company,
            eventCount,
            subscriberCount
          };
        });

        resolve({
          items: companiesWithCounts,
          meta: {
            currentPage: page,
            totalItemsCount: filteredCompanies.length,
            itemsPerPage: limit,
            totalPages: Math.ceil(filteredCompanies.length / limit)
          }
        });
      }, 1000);
    });
  }

  static getCompanyEvents(companyId: string, upcoming = false): Promise<Paginated<Event>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let companyEvents = mockEvents.filter((event) => event.company?.id === companyId);

        // Filter for upcoming events if requested
        if (upcoming) {
          const now = new Date();
          companyEvents = companyEvents.filter((event) => new Date(event.startDate) > now);
        }

        // Sort by date (upcoming first)
        companyEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        resolve({
          items: companyEvents,
          meta: {
            currentPage: 1,
            totalItemsCount: companyEvents.length,
            itemsPerPage: companyEvents.length,
            totalPages: 1
          }
        });
      }, 800);
    });
  }

  static getCompanyNews(companyId: string): Promise<Paginated<CompanyNews>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const companyNews = mockData.companyNews.filter((news) => news.companyId === companyId);

        // Sort by date (newest first)
        companyNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        resolve({
          items: companyNews,
          meta: {
            currentPage: 1,
            totalItemsCount: companyNews.length,
            itemsPerPage: companyNews.length,
            totalPages: 1
          }
        });
      }, 800);
    });
  }

  static getNewsItem(newsId: string, companyId: string): Promise<CompanyNews> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newsItem = mockData.companyNews.find((news) => news.id === newsId && news.companyId === companyId);

        if (newsItem) {
          resolve(newsItem);
        } else {
          reject(new Error('News item not found'));
        }
      }, 800);
    });
  }

  static getRelatedNews(companyId: string, excludeId?: string): Promise<CompanyNews[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let relatedNews = mockData.companyNews.filter((news) => news.companyId === companyId);

        // Exclude the current news item if provided
        if (excludeId) {
          relatedNews = relatedNews.filter((news) => news.id !== excludeId);
        }

        // Sort by date (newest first) and limit to 3
        relatedNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        relatedNews = relatedNews.slice(0, 3);

        resolve(relatedNews);
      }, 500);
    });
  }

  static getSimilarCompanies(companyId: string, limit = 3): Promise<Company[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Exclude current company and get random companies
        const otherCompanies = mockCompanies.filter((company) => company.id !== companyId);
        const shuffled = [...otherCompanies].sort(() => 0.5 - Math.random());
        const similarCompanies = shuffled.slice(0, limit);

        resolve(similarCompanies);
      }, 500);
    });
  }
}
