import dayjs from 'dayjs';
import { ChevronRight, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { ComponentProps } from 'react';

import { Link } from '../../../../shared/components/common/link';
import { Button } from '../../../../shared/components/ui/button';
import { cn } from '../../../../shared/lib/utils';
import { NewsItem } from '../../interfaces/news.interface';

interface NewsCardProps extends Partial<ComponentProps<typeof Link>> {
  item: NewsItem;
  companyId: string;
  onLike: () => void;
  onShare: () => void;
}

// Update the NewsCard component to use imageUrl instead of image
export const NewsCard = ({ item, companyId, onLike, onShare, className, ...props }: NewsCardProps) => {
  const formattedDate = dayjs(item.createdAt).format('MMM D, YYYY');

  return (
    <Link
      unstyled
      to={`/companies/${companyId}/news/${item.id}`}
      {...props}
      className={cn(
        'border rounded-lg overflow-hidden bg-card hover:border-primary transition-colors duration-300 flex',
        className
      )}>
      <div className="flex flex-col md:flex-row">
        {item.imageUrl && (
          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
            <img
              src={item.imageUrl || '/placeholder.svg'}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        <div className={`p-4 flex flex-col ${item.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.content}</p>

          <div className="mt-auto flex justify-between items-center">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={onLike} className={item.isLiked ? 'text-primary' : ''}>
                <ThumbsUp className="h-4 w-4 mr-1" />
                {item.likes || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                {item.comments || 0}
              </Button>
              <Button variant="ghost" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            <Button variant="outline" size="sm" className="gap-1">
              Read More
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
