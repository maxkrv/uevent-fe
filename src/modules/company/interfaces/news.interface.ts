// Interface for a single news item
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;

  // Additional frontend properties
  isLiked?: boolean;
  likes?: number;
  comments?: number;
}
