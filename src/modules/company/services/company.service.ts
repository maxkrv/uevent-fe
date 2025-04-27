import { Success } from '@/modules/auth/interfaces/auth.interface';
import { apiClient } from '@/shared/api/api';
import { UrlResponse } from '@/shared/types/url';

import { mockCompanies } from '../../../__mock__/companies';
import { mockData } from '../../../__mock__/data';
import type { SortOrder } from '../../../shared/types/interfaces';
import type { Paginated, PaginationDto } from '../../../shared/types/pagination';
import type { Company, CompanyDto, CompanyPromoCode, CompanyPromoCodeDto } from '../interfaces/company.interface';
import type { CompanyNews, CompanyNewsDto } from '../interfaces/news.interface';

export interface CompanyGetManyDto extends PaginationDto {
  search?: string;
  sortBy?: 'name' | 'events' | 'newest';
  sortOrder?: SortOrder;
}

export class CompanyService {
  static create(dto: CompanyDto) {
    return apiClient.post('companies', { json: dto }).json<Company>();
  }

  static update(id: string, dto: Partial<CompanyDto>) {
    return apiClient.patch(`companies/${id}`, { json: dto }).json<Company>();
  }

  static updateLogo(id: string, file: File) {
    const dto = new FormData();
    dto.append('logo', file);

    return apiClient.patch(`companies/${id}/logo`, { body: dto }).json<Success>();
  }

  static updateCover(id: string, file: File) {
    const dto = new FormData();
    dto.append('cover', file);

    return apiClient.patch(`companies/${id}/cover`, { body: dto }).json<Success>();
  }

  static getById(id: string) {
    return apiClient.get(`companies/${id}`).json<Company>();
  }

  static delete(id: string) {
    return apiClient.delete(`companies/${id}`);
  }

  static getMany(opt: CompanyGetManyDto): Promise<Paginated<Company>> {
    const searchParams = Object.entries(opt).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc.set(key, value.toString());
      }
      return acc;
    }, new URLSearchParams());

    return apiClient.get('companies', { searchParams }).json<Paginated<Company>>();
  }

  static createNewsItem(dto: CompanyNewsDto) {
    return apiClient.post('companies-news', { json: dto }).json<CompanyNews>();
  }

  static updateNewsItem(id: string, dto: CompanyNewsDto) {
    return apiClient.patch(`companies-news/${id}`, { json: dto }).json<CompanyNews>();
  }

  static updateNewsItemCover(id: string, file: File) {
    const dto = new FormData();
    dto.append('cover', file);

    return apiClient.patch(`companies-news/${id}/cover`, { body: dto }).json<Success>();
  }

  static deleteNewsItem(id: string) {
    return apiClient.delete(`companies-news/${id}`);
  }

  static getCompanyNews(companyId: string, opt?: PaginationDto): Promise<Paginated<CompanyNews>> {
    const searchParams = Object.entries(opt || {}).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc.set(key, value.toString());
      }
      return acc;
    }, new URLSearchParams());

    return apiClient.get(`companies-news/company/${companyId}`, { searchParams }).json<Paginated<CompanyNews>>();
  }

  static getNewsItem(newsId: string): Promise<CompanyNews> {
    return apiClient.get(`companies-news/${newsId}`).json<CompanyNews>();
  }

  static getRelatedNews(companyId: string, excludeId?: string): Promise<CompanyNews[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let relatedNews = mockData.companyNews.filter((news) => news.company.id === companyId);

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

  static getMyCompanies(page = 1, limit = 10): Promise<Paginated<Company>> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return apiClient
      .get('companies/my', {
        searchParams: params
      })
      .json<Paginated<Company>>();
  }

  static verify(id: string) {
    return apiClient.post(`companies/${id}/onboarding-link`).json<UrlResponse>();
  }

  static openDashboard(id: string) {
    return apiClient.post(`companies/${id}/dashboard-link`).json<UrlResponse>();
  }

  static createPromoCode(id: string, dto: CompanyPromoCodeDto) {
    return apiClient.post(`companies/${id}/promo-code`, { json: dto }).json<CompanyPromoCodeDto>();
  }

  static getPromoCodes(id: string, page = 1) {
    const params = new URLSearchParams();
    params.set('page', page.toString());

    return apiClient
      .get(`companies/${id}/promo-code`, {
        searchParams: params
      })
      .json<Paginated<CompanyPromoCode>>();
  }

  static deletePromoCode(companyId: string, id: string) {
    return apiClient.delete(`companies/${companyId}/promo-code/${id}`);
  }
}
