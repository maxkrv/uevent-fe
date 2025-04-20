import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CompanyNews, CompanyNewsDto, CompanyNewsSchema } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';

interface Props {
  news: CompanyNews;
  onSuccess?: () => void;
}

export const EditNewsForm: FC<Props> = ({ news, onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<CompanyNewsDto>({
    resolver: zodResolver(CompanyNewsSchema),
    defaultValues: {
      companyId: news.company.id,
      title: news.title,
      content: news.content
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (dto: CompanyNewsDto) => CompanyService.updateNewsItem(news.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, news.id] });
      onSuccess?.();
    }
  });

  const onSubmit = (data: CompanyNewsDto) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Name</Label>
        <Input
          {...register('title')}
          id="title"
          placeholder="Enter company name"
          errorMessage={errors.title?.message}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          {...register('content')}
          id="content"
          placeholder="Enter company name"
          errorMessage={errors.content?.message}
        />
      </div>

      <Button type="submit" disabled={!isValid || isPending} isLoading={isPending}>
        Update
      </Button>
    </form>
  );
};
